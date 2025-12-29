import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserFromClerkDto {
  @ApiProperty({ example: 'user_2b...', description: 'Clerk ID' })
  @Expose()
  @Transform(({ obj }) => {
    // Handle user.created event (id is user id) OR organizationMembership (public_user_data.user_id)
    if (typeof obj.id === 'string' && obj.id.startsWith('user_')) {
      return obj.id;
    }
    return obj.public_user_data?.user_id || obj.id;
  })
  @IsString()
  @IsNotEmpty()
  clerkId: string;

  @ApiProperty({ example: 'John Doe', description: 'User Name' })
  @Expose()
  @Transform(({ obj }) => {
    const firstName = obj.first_name || obj.public_user_data?.first_name || '';
    const lastName = obj.last_name || obj.public_user_data?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || obj.username || 'Unknown';
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User Email' })
  @Expose()
  @Transform(({ obj }) => {
    if (obj.email_addresses && obj.email_addresses.length > 0) {
      return obj.email_addresses[0].email_address;
    }
    return obj.public_user_data?.identifier;
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'https://img.clerk.com/...',
    description: 'Avatar URL',
  })
  @Expose()
  @Transform(({ obj }) => obj.image_url || obj.public_user_data?.image_url)
  @IsString()
  @IsOptional()
  avatarUrl: string;

  @ApiProperty({ example: 17092839283, description: 'Created At Timestamp' })
  @Expose({ name: 'created_at' })
  @Transform(({ value }) => (value ? new Date(value) : new Date()))
  createdAt: Date;
}

export class RoleClerkDto {
  @ApiProperty({ example: 'user', description: 'Role name' })
  @Expose({ name: 'public_user_data' })
  @Transform(({ obj }) => {
    // Handle user.created event (id is user id) OR organizationMembership (public_user_data.user_id)
    if (typeof obj.user_id === 'string' && obj.user_id.startsWith('user_')) {
      return obj.user_id;
    }
    return obj.public_user_data?.user_id || obj.user_id;
  })
  @IsString()
  @IsOptional()
  clerkId: string;
  @ApiProperty({ example: 'user', description: 'Role name' })
  @Expose({ name: 'role_name' })
  @Transform(({ value }) => value?.toLowerCase() || 'user')
  @IsString()
  @IsOptional()
  role: string;
}
