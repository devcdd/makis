import { SupabaseService } from '../supabase.service';
import { User, Character, CreateCharacterRequest } from '../../types';
export declare class UserService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    saveUser(userData: User): Promise<User[]>;
    getUserByUserId(userId: string): Promise<User | null>;
    updateUserNickname(userId: string, nickname: string): Promise<User>;
    saveCharacter(characterData: CreateCharacterRequest): Promise<Character[]>;
    getAllCharacters(): Promise<Character[]>;
}
