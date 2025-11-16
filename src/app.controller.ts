import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { MESSAGES, API_TAGS } from './constants/messages';

@ApiTags(API_TAGS.APP)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: '기본 인사말' })
  @ApiResponse({ status: 200, description: MESSAGES.SUCCESS, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  @ApiOperation({ summary: '새로운 사용자 생성', tags: [API_TAGS.USERS] })
  @ApiResponse({
    status: 201,
    description: MESSAGES.CREATE_USER_SUCCESS,
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 400, description: MESSAGES.BAD_REQUEST })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.supabaseService.saveUserId(createUserDto.userId);
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
    return await this.supabaseService.saveCoupon(createCouponDto.name);
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
    const users = await this.supabaseService.getAllUsers();

    console.log('쿠폰 이름:', couponName);
    console.log('전체 유저 리스트:', users);

    return {
      message: MESSAGES.COUPON_AUTO_PROCESS_RECEIVED,
      couponName,
      userCount: users.length,
    };
  }

  @Get('admin/users')
  @ApiOperation({
    summary: '전체 유저 리스트 조회',
    description: MESSAGES.GET_ADMIN_USERS_DESC,
    tags: [API_TAGS.ADMIN],
  })
  @ApiResponse({
    status: 200,
    description: MESSAGES.GET_USERS_SUCCESS,
    type: [UserResponseDto],
  })
  async getAdminUsers() {
    return await this.supabaseService.getAllUsers();
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
    return await this.supabaseService.getAllCoupons();
  }
}
