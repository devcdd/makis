import { SupabaseService } from '../supabase.service';
import { Coupon } from '../../types';
export declare class CouponService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    saveCoupon(name: string): Promise<Coupon[]>;
    getAllCoupons(): Promise<Coupon[]>;
}
