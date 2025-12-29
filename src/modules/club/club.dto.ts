import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDynamicQueryDto } from '../../shared/dtos/pagination.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MY_CLUB_TYPE } from './club.constant';

export class CreateClubDto {
  @ApiProperty({
    example: 'Pickleball Club',
    description: 'Tên câu lạc bộ',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'Câu lạc bộ pickleball dành cho người mới và chuyên nghiệp',
    description: 'Mô tả câu lạc bộ',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '79',
    description: 'Mã tỉnh/thành phố (province code)',
  })
  @IsString()
  @IsNotEmpty()
  provinceCode: string;

  @ApiProperty({
    example: '27123',
    description: 'Mã phường/xã (ward code)',
  })
  @IsString()
  @IsNotEmpty()
  wardCode: string;

  @ApiProperty({
    example: true,
    description: 'Câu lạc bộ công khai hay riêng tư',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1';
  })
  isPublic?: boolean;

  @ApiProperty({
    description: 'Ảnh đại diện câu lạc bộ',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  imageUrl?: any;
}

export class UpdateClubDto {
  @ApiProperty({
    example: 'Pickleball Club Updated',
    description: 'Tên câu lạc bộ',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Mô tả cập nhật',
    description: 'Mô tả câu lạc bộ',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '01',
    description: 'Mã tỉnh/thành phố (province code)',
  })
  @IsString()
  @IsNotEmpty()
  provinceCode: string;

  @ApiProperty({
    example: '27123',
    description: 'Mã phường/xã (ward code)',
  })
  @IsString()
  @IsNotEmpty()
  wardCode: string;

  @ApiProperty({
    description: 'Ảnh đại diện câu lạc bộ',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Câu lạc bộ công khai hay riêng tư',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class ClubMemberStatusDto {
  @ApiProperty({
    example: 'block',
    description: 'Trạng thái thành viên (block | kick)',
    enum: ['block', 'kick'],
  })
  @IsString()
  @IsNotEmpty()
  status: 'block' | 'kick';
}

export class queryMyClubDto extends PaginatedDynamicQueryDto {
  @ApiProperty({
    example: 'owner',
    description: 'Club đã tạo: owner, Club tham gia: member',
    enum: ['owner', 'member'],
  })
  @IsString()
  @IsNotEmpty()
  type: MY_CLUB_TYPE;
}
