import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiPaginatedResponse } from '../../common/decorator/api-pagination.response';
import { PaginationRequestDto } from '../../common/dto/pagination-request.dto';
import { AuthenticateRequestDto } from '../../common/dto/authenticate-request.dto';
import { Company } from './entities/company.entity';

@ApiTags('Company')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const { id } = request.user;

    return this.companyService.create({
      ...createCompanyDto,
      user_id: id,
    });
  }

  @Get()
  @ApiPaginatedResponse({
    model: Company,
    description: 'List of companies',
  })
  findAll(
    @Query() paginationRequestDto: PaginationRequestDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const user_id = request.user.id;

    return this.companyService.findAll(user_id, paginationRequestDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: AuthenticateRequestDto) {
    const user_id = request.user.id;

    return this.companyService.findOne(id, user_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const user_id = request.user.id;

    return this.companyService.update({ ...updateCompanyDto, id, user_id });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: AuthenticateRequestDto) {
    const user_id = request.user.id;

    return this.companyService.remove(id, user_id);
  }
}
