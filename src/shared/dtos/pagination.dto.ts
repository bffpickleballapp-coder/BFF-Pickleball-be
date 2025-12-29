import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

function sanitizeDynamicQuery(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    const value = obj[key];

    // 1. Xử lý Boolean
    if (value === 'true') {
      obj[key] = true;
    } else if (value === 'false') {
      obj[key] = false;
    }
    // 2. Xử lý Number (Nếu muốn tự động convert số)
    // Lưu ý: Cần cẩn thận với số 0 hoặc chuỗi rỗng
    else if (
      typeof value === 'string' &&
      !isNaN(Number(value)) &&
      value.trim() !== ''
    ) {
      obj[key] = Number(value);
    }
    // 3. Đệ quy nếu lồng nhau (VD: q={"price": {"gt": "100"}})
    else if (typeof value === 'object') {
      sanitizeDynamicQuery(value);
    }
  }
  return obj;
}
export class PaginationDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'Page number (zero-based)',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pageSize: number;

  @ApiPropertyOptional({
    example: '-createdAt',
    description: 'Sort order (prefix with - for descending)',
  })
  @MaxLength(60)
  @IsOptional()
  sort?: string;
}

export class QueryObject {
  [key: string]: any;
}

export class PaginatedDynamicQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiPropertyOptional({
    description: 'filter params',
    example: '{"isPublic":false}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Type(() => QueryObject)
  @Transform(
    ({ value }) => {
      // 1. Nếu là string JSON thì Parse ra Object
      let parsedValue = value;
      if (typeof value === 'string') {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          return value; // Trả về nguyên gốc để Validator báo lỗi nếu sai JSON
        }
      }

      // 2. Sau khi có Object, chạy hàm sanitize để ép kiểu từng key
      return sanitizeDynamicQuery(parsedValue);
    },
    { toClassOnly: true },
  )
  q?: QueryObject;

  @ApiPropertyOptional({
    description: 'search params',
    example: 'Pickleball',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  search?: string;
}
