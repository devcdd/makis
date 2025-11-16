import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest } from '../types';

export class CreateUserDto implements CreateUserRequest {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateNicknameDto {
  @ApiProperty({
    description: '새로운 닉네임',
    example: '새로운닉네임',
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
