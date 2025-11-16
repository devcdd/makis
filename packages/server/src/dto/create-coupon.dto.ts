import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCouponRequest } from '../types';

export class CreateCouponDto implements CreateCouponRequest {
  @ApiProperty({
    description: '쿠폰 이름',
    example: 'discount_coupon',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
