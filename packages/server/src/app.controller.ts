import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import axios from 'axios';
import { AdminGuard } from './auth/admin.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { UserService } from './supabase/user';
import { CouponService } from './supabase/coupon';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { MESSAGES, API_TAGS } from './constants/messages';

interface MapleStoryApiResponse {
  result?: boolean;
  code?: number;
  message?: string;
  gc_count?: number;
  existCharacter?: boolean;
}

@ApiTags(API_TAGS.APP)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
    private readonly couponService: CouponService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 메이플스토리 캐릭터 ID 형식 검증
   * 실제 API 호출 대신 안전한 형식 검증만 수행
   */
  private validateMapleCharacter(characterId: string, userId: string): boolean {
    try {
      console.log('🔍 VALIDATE_CHARACTER 호출됨:', { characterId, userId });

      // 기본 형식 검증
      if (!characterId || typeof characterId !== 'string') {
        console.log('캐릭터 ID가 유효하지 않음: 값이 없거나 문자열이 아님');
        return false;
      }

      // 길이 검증 (메이플스토리 캐릭터 ID는 보통 13자리)
      if (characterId.length !== 13) {
        console.log(
          `캐릭터 ID 길이가 잘못됨: ${characterId.length}자 (예상: 13자)`,
        );
        return false;
      }

      // 숫자만 포함되어 있는지 검증
      if (!/^\d+$/.test(characterId)) {
        console.log('캐릭터 ID가 숫자로만 구성되지 않음');
        return false;
      }

      console.log('캐릭터 ID 형식 검증 성공');
      return true;
    } catch (error) {
      console.error('캐릭터 ID 검증 중 오류 발생:', error);
      return false;
    }
  }

  /**
   * 메이플스토리 쿠폰 등록
   */
  private async enrollMapleCoupon(
    characterId: string,
    coupon: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('메이플스토리 쿠폰 등록 시작:', { characterId, coupon });

      const response = await axios.post<MapleStoryApiResponse>(
        'https://mcoupon.nexon.com/maplestoryidle/coupon/api/v1/redeem-coupon-by-npacode',
        {
          coupon: coupon,
          id: 'null',
          npaCode: characterId,
        },
      );

      console.log(
        '메이플스토리 쿠폰 등록 응답:',
        JSON.stringify(response.data, null, 2),
      );

      // 성공 응답 확인 (result: true, code: 0)
      if (response.data.result === true && response.data.code === 0) {
        console.log('쿠폰 등록 성공');
        return {
          success: true,
          message: response.data.message || '쿠폰 등록 성공',
        };
      }

      // 실패 응답 처리
      console.log(
        '쿠폰 등록 실패:',
        response.data.message || '알 수 없는 오류',
      );
      return {
        success: false,
        message: response.data.message || '쿠폰 등록 실패',
      };
    } catch (error) {
      console.error('메이플스토리 쿠폰 등록 API 호출 실패:', error);
      return { success: false, message: 'API 호출 실패' };
    }
  }

  @Get()
  @ApiOperation({ summary: '기본 인사말' })
  @ApiResponse({ status: 200, description: MESSAGES.SUCCESS, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post('characters')
  @ApiOperation({ summary: '새로운 캐릭터 생성', tags: [API_TAGS.USERS] })
  @ApiResponse({
    status: 201,
    description: MESSAGES.CREATE_CHARACTER_SUCCESS,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: MESSAGES.CREATE_CHARACTER_SUCCESS },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: MESSAGES.BAD_REQUEST })
  @ApiResponse({
    status: 409,
    description: MESSAGES.DUPLICATE_CHARACTER_ID,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: MESSAGES.DUPLICATE_CHARACTER_ID },
      },
    },
  })
  async createCharacter(
    @Req() request: Request,
    @Body() body: { characterId: string },
  ) {
    // JwtAuthGuard로 인증되었으므로 토큰에서 무조건 userId 추출 가능
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verifyResult = this.jwtService.verify(
      request.headers.authorization!.substring(7),
    ) as any;
    const ownerId = verifyResult.userId;

    // 캐릭터 존재 여부 검증 (토큰이 있으므로 무조건 수행)
    const isValidCharacter = await this.validateMapleCharacter(
      body.characterId,
      ownerId,
    );
    if (!isValidCharacter) {
      throw new HttpException(
        '유효하지 않은 캐릭터입니다. 메이플스토리 캐릭터 정보를 확인해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.userService.saveCharacter({
        characterId: body.characterId,
        ownerId: ownerId,
      });

      return result;
    } catch (error) {
      // 이미 등록된 캐릭터 에러 처리 (PostgreSQL error code 23505)
      if (
        error instanceof Error &&
        error.message === MESSAGES.DUPLICATE_CHARACTER_ID
      ) {
        throw new HttpException(
          {
            success: false,
            message: MESSAGES.DUPLICATE_CHARACTER_ID,
          },
          HttpStatus.CONFLICT, // 409 Conflict
        );
      }

      // 다른 에러는 그대로 throw
      throw error;
    }
  }

  @Post('coupons')
  @ApiOperation({ summary: '새로운 쿠폰 생성', tags: [API_TAGS.COUPONS] })
  @ApiResponse({
    status: 201,
    description: MESSAGES.CREATE_COUPON_SUCCESS,
    type: [CouponResponseDto],
  })
  @ApiResponse({ status: 400, description: MESSAGES.BAD_REQUEST })
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.saveCoupon(createCouponDto.name);
  }

  @Get('auto/coupon/:couponName')
  @ApiOperation({
    summary: '쿠폰 자동 배포 요청',
    description: MESSAGES.COUPON_AUTO_PROCESS_DESC,
    tags: [API_TAGS.AUTO],
  })
  @ApiParam({
    name: 'couponName',
    description: '배포할 쿠폰 이름',
    example: 'discount_coupon',
  })
  @ApiResponse({
    status: 200,
    description: MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        couponName: { type: 'string' },
        userCount: { type: 'number' },
      },
    },
  })
  async getAutoCoupon(@Param('couponName') couponName: string) {
    const characters = await this.userService.getAllCharacters();

    console.log('쿠폰 이름:', couponName);
    console.log('전체 캐릭터 리스트:', characters);

    return {
      message: MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
      couponName,
      characterCount: characters.length,
    };
  }

  @UseGuards(AdminGuard)
  @Get('admin/characters')
  @ApiOperation({
    summary: '전체 캐릭터 리스트 조회',
    description: MESSAGES.GET_ADMIN_USERS_DESC,
    tags: [API_TAGS.ADMIN],
  })
  @ApiResponse({
    status: 200,
    description: MESSAGES.GET_USERS_SUCCESS,
    type: [UserResponseDto],
  })
  async getAdminCharacters() {
    return await this.userService.getAllCharacters();
  }

  @UseGuards(AdminGuard)
  @Get('admin/coupons')
  @ApiOperation({
    summary: '전체 쿠폰 리스트 조회',
    description: MESSAGES.GET_ADMIN_COUPONS_DESC,
    tags: [API_TAGS.ADMIN],
  })
  @ApiResponse({
    status: 200,
    description: MESSAGES.GET_COUPONS_SUCCESS,
    type: [CouponResponseDto],
  })
  async getAdminCoupons() {
    console.log('=== getAdminCoupons 호출됨 ===');
    const result = await this.couponService.getAllCoupons();
    console.log('=== getAdminCoupons 완료 ===');
    return result;
  }

  @UseGuards(AdminGuard)
  @Post('admin/auto-coupon/:couponId')
  @ApiOperation({
    summary: '쿠폰 자동 배포',
    description: '전체 캐릭터에게 지정된 쿠폰을 자동으로 배포합니다.',
    tags: [API_TAGS.ADMIN],
  })
  @ApiParam({
    name: 'couponId',
    description: '배포할 쿠폰 코드',
    example: 'NO1MAPLEIDLE',
  })
  @ApiResponse({
    status: 200,
    description: '쿠폰 배포 완료',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        totalCharacters: { type: 'number' },
        successCount: { type: 'number' },
        failureCount: { type: 'number' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              characterId: { type: 'string' },
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async autoDistributeCoupon(@Param('couponId') couponId: string) {
    try {
      console.log('쿠폰 자동 배포 시작:', couponId);

      // 전체 캐릭터 리스트 가져오기
      const characters = await this.userService.getAllCharacters();
      console.log(`전체 캐릭터 수: ${characters.length}`);

      const results = [];
      let successCount = 0;
      let failureCount = 0;

      // 각 캐릭터에게 쿠폰 배포
      for (const character of characters) {
        try {
          const result = await this.enrollMapleCoupon(
            character.characterId,
            couponId,
          );

          if (result.success) {
            successCount++;
          } else {
            failureCount++;
          }

          results.push({
            characterId: character.characterId,
            success: result.success,
            message: result.message,
          });

          // API 호출 간격 조절 (너무 빠른 호출 방지)
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(
            `캐릭터 ${character.characterId} 쿠폰 배포 실패:`,
            error,
          );
          failureCount++;
          results.push({
            characterId: character.characterId,
            success: false,
            message: 'API 호출 실패',
          });
        }
      }

      console.log(
        `쿠폰 배포 완료 - 성공: ${successCount}, 실패: ${failureCount}`,
      );

      return {
        message: '쿠폰 자동 배포가 완료되었습니다.',
        totalCharacters: characters.length,
        successCount,
        failureCount,
        results,
      };
    } catch (error) {
      console.error('쿠폰 자동 배포 중 오류 발생:', error);
      throw new HttpException(
        '쿠폰 자동 배포 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
