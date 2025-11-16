import { ApiProperty } from '@nestjs/swagger';

export class CouponResponseDto {
  @ApiProperty({ description: '쿠폰 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '쿠폰 이름', example: 'discount_coupon' })
  name: string;

  @ApiProperty({ description: '생성일시', example: '2023-12-01T00:00:00.000Z' })
  createdAt: string;
}
