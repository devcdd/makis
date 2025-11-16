import { axiosInstance } from '@/shared/lib';
import type { AuthResponse } from '@/entities/user';

export interface KakaoCallbackRequest {
  code: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export type { AuthResponse };

export const authApi = {
  kakaoCallback: async (
    request: KakaoCallbackRequest,
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/kakao/callback',
      request,
    );
    return response.data;
  },

  updateNickname: async (
    userId: string,
    request: UpdateNicknameRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.patch(
      `/auth/user/${userId}/nickname`,
      request,
    );
    return response.data;
  },
};
