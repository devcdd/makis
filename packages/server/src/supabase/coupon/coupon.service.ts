import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { Coupon } from '../../types';
import { ERROR_LOG_PREFIX } from '../../constants/messages';

@Injectable()
export class CouponService {
  constructor(private supabaseService: SupabaseService) {}

  async saveCoupon(name: string): Promise<Coupon[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('coupon')
      .insert([{ name: name }])
      .select();

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    return data as Coupon[];
  }

  async getAllCoupons(): Promise<Coupon[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('coupon')
      .select('*');

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    return data as Coupon[];
  }
}
