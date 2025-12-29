import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
  MaxLength,
  IsNotEmpty,
  IsDefined,
  MinLength,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../../shared/dtos/address.dto';

export class CreateVenueDto {
  @ApiProperty({
    example: 'Sân Pickleball Quận 1',
    description: 'Tên của sân pickleball',
    minLength: 1,
    maxLength: 200,
    required: true,
  })
  @IsDefined({ message: 'Name is required' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1)
  @MaxLength(200, { message: 'Name must not exceed 200 characters' })
  name: string;

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
  provinceCode: string;

  @ApiProperty({
    example: 'Phường Bến Nghé',
    description: 'Mã phường/xã',
    minLength: 1,
    maxLength: 255,
    required: true,
  })
  @IsDefined({ message: 'Ward is required' })
  @IsString()
  @IsNotEmpty({ message: 'Ward is required' })
  @MinLength(1)
  @MaxLength(255, { message: 'Ward must not exceed 255 characters' })
  wardCode: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ chi tiết dạng JSON',
    type: AddressDto,
    example: {
      province: 'TP',
      ward: 'Phường',
      detail: '123 Nguyễn Huệ',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({
    example: 'https://maps.google.com/?q=10.7769,106.7009',
    description: 'Link Google Maps của sân',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Google Maps link must not exceed 500 characters',
  })
  linkGgmap?: string;

  @ApiPropertyOptional({
    example:
      'Sân pickleball hiện đại với đầy đủ tiện nghi, có chỗ đậu xe rộng rãi.',
    description: 'Mô tả chi tiết về sân',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;
}
