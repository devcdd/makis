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
