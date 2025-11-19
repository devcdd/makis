import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { KakaoCallbackDto, AuthResponseDto } from '../dto/kakao-callback.dto';
import { UpdateNicknameDto } from '../dto/create-user.dto';
import { UserService } from '../supabase/user';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    kakaoCallback(callbackDto: KakaoCallbackDto, request: Request, response: Response): Promise<AuthResponseDto>;
    updateNickname(userId: string, updateNicknameDto: UpdateNicknameDto): Promise<import("../types").User>;
    refreshTokens(request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
}
