import { Strategy } from 'passport-jwt';
import { UserService } from '../supabase/user';
import { JwtPayload } from '../types';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        provider: import("../types").Provider;
        nickname: string | undefined;
    }>;
}
export {};
