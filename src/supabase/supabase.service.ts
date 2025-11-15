import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async saveUserId(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ user_id: userId, created_at: new Date().toISOString() }]);

    if (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }

    return data;
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
