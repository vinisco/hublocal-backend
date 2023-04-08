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

import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiPaginatedResponse } from '../../common/decorator/api-pagination.response';
import { AuthenticateRequestDto } from '../../common/dto/authenticate-request.dto';
import { Local } from './entities/local.entity';
import { FindAllLocalDto } from './dto/findAll-local.dto';

@ApiTags('Local')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('locals')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  create(
    @Body() createLocalDto: CreateLocalDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const { id } = request.user;

    return this.localService.create({
      ...createLocalDto,
      user_id: id,
    });
  }

  @Get()
  @ApiPaginatedResponse({
    model: Local,
    description: 'List of locals',
  })
  findAll(
    @Query() findAllLocalDto: FindAllLocalDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const user_id = request.user.id;

    return this.localService.findAll(user_id, findAllLocalDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: AuthenticateRequestDto) {
    const user_id = request.user.id;

    return this.localService.findOne(id, user_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocalDto: UpdateLocalDto,
    @Request() request: AuthenticateRequestDto,
  ) {
    const user_id = request.user.id;

    return this.localService.update({ ...updateLocalDto, id, user_id });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: AuthenticateRequestDto) {
    const user_id = request.user.id;

    return this.localService.remove(id, user_id);
  }
}
