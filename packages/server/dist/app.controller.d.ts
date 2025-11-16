import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';
import { UserService } from './supabase/user';
import { CouponService } from './supabase/coupon';
import { CreateCouponDto } from './dto/create-coupon.dto';
export declare class AppController {
    private readonly appService;
    private readonly supabaseService;
    private readonly userService;
    private readonly couponService;
    private readonly jwtService;
    constructor(appService: AppService, supabaseService: SupabaseService, userService: UserService, couponService: CouponService, jwtService: JwtService);
    private validateMapleCharacter;
    getHello(): string;
    createCharacter(request: Request, body: {
        characterId: string;
    }): Promise<import("./types").Character[]>;
    createCoupon(createCouponDto: CreateCouponDto): Promise<import("./types").Coupon[]>;
    getAutoCoupon(couponName: string): Promise<{
        message: "쿠폰 자동 처리 요청이 접수되었습니다.";
        couponName: string;
        characterCount: number;
    }>;
    getAdminCharacters(): Promise<import("./types").Character[]>;
    getAdminCoupons(): Promise<import("./types").Coupon[]>;
}
