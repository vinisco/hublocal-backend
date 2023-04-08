import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import genFake from '../../../common/utils/genFake.util';

export class CreateLocalDto {
  @ApiProperty({
    description: `Local name`,
    example: genFake.localName(),
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: `Local CEP`,
    example: genFake.localCEP(),
  })
  @IsString()
  cep: string;

  @ApiProperty({
    description: `Local street`,
    example: genFake.localStreet(),
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: `Local number`,
    example: genFake.localNumber(),
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: `Local neighborhood`,
    example: genFake.localNeighbor(),
  })
  @IsString()
  neighborhood: string;

  @ApiProperty({
    description: `Local city`,
    example: genFake.localCity(),
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: `Local state`,
    example: genFake.localState(),
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: `Company id`,
    example: genFake.uuid(),
  })
  @IsString()
  company_id: string;

  @ApiHideProperty()
  readonly user_id?: string;
}
