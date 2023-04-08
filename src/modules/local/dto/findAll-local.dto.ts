import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PaginationRequestDto } from '../../../common/dto/pagination-request.dto';
import genFake from '../../../common/utils/genFake.util';

export class FindAllLocalDto extends PartialType(PaginationRequestDto) {
  @ApiProperty({
    description: `Company id`,
    example: genFake.uuid(),
  })
  @IsString()
  company_id: string;
}
