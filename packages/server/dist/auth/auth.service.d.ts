import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../supabase/user';
import { KakaoCallbackDto, AuthResponseDto } from '../dto/kakao-callback.dto';
export declare class AuthService {
    private readonly configService;
    private readonly userService;
    private readonly jwtService;
    constructor(configService: ConfigService, userService: UserService, jwtService: JwtService);
    handleKakaoCallback(callbackDto: KakaoCallbackDto): Promise<AuthResponseDto>;
    private exchangeCodeForToken;
    private getKakaoUserInfo;
    private processUserLogin;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateToken(token: string): Promise<any>;
}
