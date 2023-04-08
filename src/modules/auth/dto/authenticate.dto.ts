import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

import genFake from '../../../common/utils/genFake.util';

export class AuthenticateDto {
  @ApiProperty({
    example: genFake.userEmail(),
    description: `User email`,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: genFake.userPassword(),
    description: `User password`,
  })
  @IsString()
  readonly password: string;
}
