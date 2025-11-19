import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { User, Character, CreateCharacterRequest, Provider } from '../../types';
import { MESSAGES, ERROR_LOG_PREFIX } from '../../constants/messages';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  // ===== USERS 테이블 관련 메소드 =====

  async saveUser(userData: User): Promise<User[]> {
    // SUPABASE 환경변수 디버깅 출력
    console.log('=== SUPABASE 환경변수 확인 ===');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY 존재:', !!process.env.SUPABASE_ANON_KEY);
    console.log(
      'SUPABASE_ANON_KEY 길이:',
      process.env.SUPABASE_ANON_KEY?.length,
    );
    console.log('=== 사용자 데이터 ===');
    console.log('userData:', JSON.stringify(userData, null, 2));

    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert([userData])
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

  async getUserByUserId(userId: string): Promise<User | null> {
    console.log('=== getUserByUserId 호출 ===');
    console.log('조회할 userId:', userId);

    const client = this.supabaseService.getClient();
    console.log('Supabase 클라이언트 URL:', (client as any).supabaseUrl);

    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      console.log('supabase error:', error);

      // PGRST116: 데이터가 없는 경우 - 유저 생성
      if (error.code === 'PGRST116') {
        console.log('유저를 찾을 수 없음. 새로운 유저 생성:', userId);
        const createdUsers = await this.saveUser({
          userId,
          provider: Provider.KAKAO,
        });
        console.log('유저 생성 완료:', userId);
        return createdUsers[0];
      }

      // 다른 에러인 경우 throw
      console.error('유저 조회 중 에러 발생:', error);
      throw error;
    }

    // 데이터가 있는 경우
    console.log('유저 조회 성공:', userId);
    return data as User;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    console.log('=== isUserAdmin 호출 ===');
    console.log('관리자 권한 확인할 userId:', userId);

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select('isAdmin')
        .eq('userId', userId)
        .single();

      if (error) {
        console.error('관리자 권한 조회 실패:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return false; // 에러 발생시 기본적으로 false 반환
      }

      const isAdmin = data?.isAdmin === true;
      console.log(`사용자 ${userId} 관리자 권한:`, isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('관리자 권한 확인 중 예외 발생:', error);
      return false; // 예외 발생시 기본적으로 false 반환
    }
  }

  async updateUserNickname(userId: string, nickname: string): Promise<User> {
    console.log('=== updateUserNickname 호출 ===');
    console.log('userId:', userId, 'nickname:', nickname);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ nickname })
      .eq('userId', userId)
      .select()
      .single();

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('닉네임 업데이트 성공:', userId, nickname);
    return data as User;
  }

  // ===== CHARACTERS 테이블 관련 메소드 =====

  async saveCharacter(
    characterData: CreateCharacterRequest,
  ): Promise<{ success: boolean; message: string; data?: Character[] }> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('characters')
      .insert([
        {
          characterId: characterData.characterId,
          ownerId: characterData.ownerId,
        },
      ])
      .select();

    if (error) {
      console.error(ERROR_LOG_PREFIX.SUPABASE_ERROR_DETAILS, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === '23505') {
        throw new Error(MESSAGES.DUPLICATE_CHARACTER_ID);
      }

      throw error;
    }

    return {
      success: true,
      message: MESSAGES.CREATE_CHARACTER_SUCCESS,
      data: data as Character[],
    };
  }

  async getAllCharacters(): Promise<Character[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('characters')
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

    return data as Character[];
  }
}
