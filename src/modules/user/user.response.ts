import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLE } from '../../shared/constants/bases.enum';
// Base User Response (Cấu trúc chung của 1 user)
export class UserResponse {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID',
  })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  name: string;

  @ApiPropertyOptional({ example: 'https://img.clerk.com/...' })
  avatar_url: string | null;

  @ApiPropertyOptional({ example: 100 })
  points: number | null;

  @ApiPropertyOptional({ example: 'DUPR123' })
  dupr_id: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'true: Male, false: Female',
  })
  gender: boolean | null;

  @ApiPropertyOptional({ example: { bankName: 'MB', account: '0000' } })
  banking_info: Record<string, any> | null;

  @ApiProperty({ enum: ROLE, example: ROLE.USER })
  role: ROLE;

  @ApiPropertyOptional({ example: '79' })
  province_code: string | null;

  @ApiPropertyOptional({ example: '760' })
  ward_code: string | null;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 1703123456000 })
  created_at: number; // Timestamp

  @ApiPropertyOptional({ example: 1703123456000 })
  updated_at: number | null;
}
