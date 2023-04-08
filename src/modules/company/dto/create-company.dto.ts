import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import genFake from '../../../common/utils/genFake.util';

export class CreateCompanyDto {
  @ApiProperty({ example: genFake.companyName(), description: `Company name` })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: genFake.companyWebsite(),
    description: `Company website`,
  })
  @IsString()
  readonly website: string;

  @ApiProperty({
    example: genFake.companyCNPJ(),
    description: `Company cnpj`,
  })
  @IsString()
  readonly cnpj: string;

  @ApiHideProperty()
  readonly user_id?: string;
}
