import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'color',
    description: 'The color of the user',
    required: false,
  })
  color?: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
    required: false,
  })
  role?: string;

  @ApiProperty({
    example: 'annotations',
    description: 'The annotations of the user',
    required: false,
  })
  annotations?: string;
}
