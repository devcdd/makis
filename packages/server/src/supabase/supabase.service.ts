import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MESSAGES } from '../constants/messages';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    console.log('=== SupabaseService 초기화 ===');
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('SUPABASE_URL 존재:', !!supabaseUrl);
    console.log('SUPABASE_ANON_KEY 존재:', !!supabaseKey);
    console.log('SUPABASE_ANON_KEY 길이:', supabaseKey?.length);
    console.log('SUPABASE_ANON_KEY 앞 10자:', supabaseKey?.substring(0, 10));

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(MESSAGES.MISSING_SUPABASE_ENV_VARS);
    }

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
    console.log('Supabase 클라이언트 생성 완료');
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
