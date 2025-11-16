import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '사용자 식별자', example: 'user123' })
  userId: string;

  @ApiProperty({ description: '생성일시', example: '2023-12-01T00:00:00.000Z' })
  createdAt: string;
}
