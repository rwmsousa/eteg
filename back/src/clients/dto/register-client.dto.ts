import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the client' })
  name: string;

  @ApiProperty({ example: '12345678900', description: 'The CPF of the client' })
  cpf: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the client',
  })
  email: string;

  @ApiProperty({
    example: 'blue',
    description: 'The favorite color of the client',
  })
  color: string;

  @ApiProperty({
    example: 'Some annotations',
    description: 'Additional annotations',
  })
  annotations: string;
}
