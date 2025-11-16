import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { UserService } from './user';
import { CouponService } from './coupon';

@Module({
  providers: [SupabaseService, UserService, CouponService],
  exports: [SupabaseService, UserService, CouponService],
})
export class SupabaseModule {}
