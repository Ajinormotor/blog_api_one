import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../enum/users.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User email',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'User role',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRoles, { message: 'Role must be either admin or user' })
  role: UserRoles;
}
