import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib';

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    characterId: string;
    createdAt: string;
  };
}

export const registerUser = async (
  characterId: string,
): Promise<RegisterUserResponse> => {
  const response = await axiosInstance.post<RegisterUserResponse>(
    '/characters',
    {
      characterId: characterId,
    },
  );

  return response.data;
};

export const useRegisterUserMutation = () => {
  return useMutation({
    mutationFn: registerUser,
    mutationKey: ['registerUser'],
  });
};
