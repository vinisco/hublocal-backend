import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

import genFake from '../../../common/utils/genFake.util';

export class CreateUserDto {
  @ApiProperty({ example: genFake.userName(), description: `User name` })
  @IsString()
  readonly name: string;

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
