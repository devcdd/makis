import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Coupon } from '../types';
import { MESSAGES, ERROR_LOG_PREFIX } from '../constants/messages';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(MESSAGES.MISSING_SUPABASE_ENV_VARS);
    }

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
  }

  async saveUserId(userId: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ userId: userId }])
      .select();

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === '23505') {
        throw new Error(MESSAGES.DUPLICATE_USER_ID);
      }

      throw error;
    }

    return data as User[];
  }

  async saveCoupon(name: string): Promise<Coupon[]> {
    const { data, error } = await this.supabase
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

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    return data as User[];
  }

  async getAllCoupons(): Promise<Coupon[]> {
    const { data, error } = await this.supabase.from('coupons').select('*');

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

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
