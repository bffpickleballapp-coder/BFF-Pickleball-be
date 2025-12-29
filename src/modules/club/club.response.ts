import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ClubOwnerResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatarUrl: string | null;
}

export class ClubResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pickleball Club' })
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  ownerId: string;

  @ApiProperty({ example: 'A friendly club for everyone', nullable: true })
  description: string | null;

  @ApiProperty({ example: '79' })
  provinceCode: string;

  @ApiProperty({ example: '00123' })
  wardCode: string;

  @ApiProperty({
    example: 'https://example.com/club-cover.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({ example: 50 })
  totalMembers: number;

  @ApiProperty({ example: true, nullable: true })
  isPublic: boolean | null;

  @ApiProperty({ example: '2023-10-01T07:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-05T07:00:00.000Z', nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: ClubOwnerResponse })
  owner: ClubOwnerResponse;
}

class ClubMemberResponse {
  @ApiProperty({ example: 'pending' })
  status?: string;
  @ApiProperty({ example: '2023-10-01T07:00:00.000Z' })
  joinedAt: Date;
}
export class ClubListResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pickleball Club' })
  name: string;
  @ApiProperty({
    example: 'https://example.com/club-cover.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({ example: 50 })
  totalMembers: number;

  @ApiProperty({ type: ClubMemberResponse, isArray: true })
  members: ClubMemberResponse[];
}
export class ClubPaginationResponse {
  @ApiProperty({ type: ClubListResponse, isArray: true })
  data: ClubListResponse[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 1 })
  limit: number;
}
