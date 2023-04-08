import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    example: 1,
    description: `Page number of pagination`,
    required: false,
  })
  page: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    example: 10,
    description: `Results per page limit`,
    required: false,
  })
  limit: number;
}
