import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import axios from 'axios';
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
   * 메이플스토리 캐릭터 존재 여부 검증
   */
  private async validateMapleCharacter(
    characterId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      console.log('메이플스토리 API 호출 시작:', { characterId, userId });

      if (characterId?.length !== 13) {
        return false;
      }

      const response = await axios.post<MapleStoryApiResponse>(
        'https://mcoupon.nexon.com/maplestoryidle/coupon/api/v1/redeem-coupon-by-npacode',
        {
          coupon: 'NO1MAPLEIDLE',
          id: 'null',
          npaCode: characterId,
        },
      );

      console.log(
        '메이플스토리 API 응답:',
        JSON.stringify(response.data, null, 2),
      );

      // existCharacter 필드가 false이면 존재하지 않는 캐릭터
      if (response.data.existCharacter === false) {
        console.log('캐릭터 검증 실패: existCharacter가 false');
        return false;
      }

      // existCharacter 필드가 없거나 true이면 존재하는 캐릭터
      console.log('캐릭터 검증 성공');
      return true;
    } catch (error) {
      console.error('메이플스토리 API 호출 실패:', error);
      // API 호출 실패시 보수적으로 false 반환
      return false;
    }
  }

  @Get()
  @ApiOperation({ summary: '기본 인사말' })
  @ApiResponse({ status: 200, description: MESSAGES.SUCCESS, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('characters')
  @ApiOperation({ summary: '새로운 캐릭터 생성', tags: [API_TAGS.USERS] })
  @ApiResponse({
    status: 201,
    description: MESSAGES.CREATE_USER_SUCCESS,
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 400, description: MESSAGES.BAD_REQUEST })
  async createCharacter(
    @Req() request: Request,
    @Body() body: { characterId: string },
  ) {
    // JWT 토큰에서 사용자 정보 추출
    let ownerId: string | null = null;

    try {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // "Bearer " 제거
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verifyResult = this.jwtService.verify(token) as any;
        // JWT 라이브러리의 타입 정의가 불완전해서 any 타입 사용
        ownerId = verifyResult.userId;
      }
    } catch (error) {
      // 토큰이 유효하지 않거나 없는 경우 ownerId는 null로 유지
      console.log(
        '토큰 파싱 실패 또는 토큰 없음:',
        error instanceof Error ? error.message : String(error),
      );
    }

    // 캐릭터 존재 여부 검증
    if (ownerId) {
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
    }

    return await this.userService.saveCharacter({
      characterId: body.characterId,
      ownerId: ownerId,
    });
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
    return await this.couponService.getAllCoupons();
  }
}
