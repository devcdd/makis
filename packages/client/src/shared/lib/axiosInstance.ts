import axios from 'axios';
import { getRefreshToken, setRefreshToken, clearAuthCookies } from './cookies';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// 토큰을 가져오는 함수 (순환 의존성 방지를 위해 직접 store import 대신 함수로 분리)
const getAccessToken = (): string | null => {
  try {
    // localStorage에서 직접 가져옴 (useAuthStore의 persist 설정과 동일)
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.accessToken || null;
    }
    return null;
  } catch {
    return null;
  }
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // AccessToken 추가
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // RefreshToken이 쿠키에 있는 경우 함께 전송 (선택사항)
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 헤더에서 새로운 토큰이 있는지 확인하고 저장
    const newAccessToken = response.headers['x-access-token'];
    const newRefreshToken = response.headers['x-refresh-token'];

    // 로그인 시점에 refreshToken이 헤더로 오는 경우 (쿠키에 저장)
    if (newRefreshToken && !newAccessToken) {
      const { setRefreshToken } = require('./cookies');
      setRefreshToken(newRefreshToken);
    }

    if (newAccessToken) {
      // 새로운 accessToken을 localStorage에 저장 (useAuthStore와 동일한 방식)
      try {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
          const parsed = JSON.parse(authData);
          parsed.state.accessToken = newAccessToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      } catch (error) {
        console.error('Failed to save new access token:', error);
      }
    }

    if (newRefreshToken) {
      // 새로운 refreshToken을 쿠키에 저장
      setRefreshToken(newRefreshToken);
    }

    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized인 경우 토큰 만료 처리
      if (error.response.status === 401) {
        // 인증 실패 시 토큰 정리
        try {
          localStorage.removeItem('auth-storage');
          clearAuthCookies();
        } catch (error) {
          console.error('Failed to clear auth data:', error);
        }
      }

      const message =
        error.response.data?.message || `HTTP ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('네트워크 오류가 발생했습니다.');
    } else {
      // 기타 오류
      throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  },
);
