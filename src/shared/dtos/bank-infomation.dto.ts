import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BankInformationDto {
  @ApiProperty({
    example: 'MB',
    description: 'Bank code',
    minLength: 1,
    maxLength: 50,
    required: true,
  })
  @IsDefined({ message: 'Bank code is required' })
  @IsString()
  @IsNotEmpty({ message: 'Bank code is required' })
  @MinLength(1)
  @MaxLength(50, { message: 'Bank code must not exceed 50 characters' })
  bankCode: string;

  @ApiProperty({
    example: 'MB bank',
    description: 'Bank name',
    minLength: 1,
    maxLength: 255,
    required: true,
  })
  @IsDefined({ message: 'Bank name is required' })
  @IsString()
  @IsNotEmpty({ message: 'Bank name is required' })
  @MinLength(1)
  @MaxLength(255, { message: 'Bank name must not exceed 255 characters' })
  bankName: string;

  @ApiProperty({
    example: '123456789',
    description: 'Bank number',
    minLength: 1,
    maxLength: 500,
    required: true,
  })
  @IsDefined({ message: 'Bank number is required' })
  @IsString()
  @IsNotEmpty({ message: 'Bank number is required' })
  @MinLength(1)
  @MaxLength(500, { message: 'Bank number must not exceed 500 characters' })
  bankNumber: string;

  @ApiProperty({
    example: 'NGUYEN VAN A',
    description: 'Bank account',
    minLength: 1,
    maxLength: 500,
    required: true,
  })
  @IsDefined({ message: 'Bank account is required' })
  @IsString()
  @IsNotEmpty({ message: 'Bank account is required' })
  @MinLength(1)
  @MaxLength(500, { message: 'Bank account must not exceed 500 characters' })
  bankAccount: string;
}
