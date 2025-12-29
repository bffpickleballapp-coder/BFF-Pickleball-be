import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

/**
 * AddressDto represents the structured address object stored in the database as a JSON/JSONB column.
 * Stored in Prisma model as `address Json @db.JsonB` (serialized object). Validate nested fields below.
 */
export class AddressDto {
  @ApiProperty({
    example: 'TP HCM',
    description: 'The province',
    minLength: 1,
    maxLength: 255,
    required: true,
  })
  @IsDefined({ message: 'Province is required' })
  @IsString()
  @IsNotEmpty({ message: 'Province is required' })
  @MinLength(1)
  @MaxLength(255, { message: 'Province must not exceed 255 characters' })
  province: string;

  @ApiProperty({
    example: 'Ward 1',
    description: 'The Ward',
    minLength: 1,
    maxLength: 255,
    required: true,
  })
  @IsDefined({ message: 'Ward is required' })
  @IsString()
  @IsNotEmpty({ message: 'Ward is required' })
  @MinLength(1)
  @MaxLength(255, { message: 'Ward must not exceed 255 characters' })
  ward: string;

  @ApiProperty({
    example: '123 Hoang Hoa Tham',
    description: 'The street address',
    minLength: 1,
    maxLength: 500,
    required: true,
  })
  @IsDefined({ message: 'Detail is required' })
  @IsString()
  @IsNotEmpty({ message: 'Detail is required' })
  @MinLength(1)
  @MaxLength(500, { message: 'Detail must not exceed 500 characters' })
  detail: string;
}
