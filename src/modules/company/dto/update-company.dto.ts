import { ApiHideProperty, PartialType } from '@nestjs/swagger';

import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiHideProperty()
  id: string;
}
