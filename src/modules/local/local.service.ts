import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { Local } from './entities/local.entity';
import { CompanyService } from '../company/company.service';
import { FindAllLocalDto } from './dto/findAll-local.dto';

@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Local)
    private readonly localRepository: Repository<Local>,
    private readonly companyService: CompanyService,
  ) {}

  async create(createLocalDto: CreateLocalDto) {
    const company = await this.companyService.findOne(
      createLocalDto.company_id,
      createLocalDto.user_id,
    );

    if (!company) {
      throw new NotFoundException(
        `Company not found or belongs to another user`,
      );
    }

    const local = this.localRepository.create(createLocalDto);

    return await this.localRepository.save(local);
  }

  async findAll(user_id: string, findAllLocalDto: FindAllLocalDto) {
    const { page = 1, limit = 10 } = findAllLocalDto;

    const company = await this.companyService.findOne(
      findAllLocalDto.company_id,
      user_id,
    );

    if (!company) {
      throw new NotFoundException(
        `Company not found or belongs to another user`,
      );
    }

    const skip = Math.abs(page - 1) * limit;

    const results = await this.localRepository.find({
      where: {
        company_id: findAllLocalDto.company_id,
      },
      skip,
      take: limit,
    });

    const total = await this.localRepository.count({
      where: {
        company_id: findAllLocalDto.company_id,
      },
    });

    return {
      results,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, user_id: string) {
    const local = await this.localRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!local) {
      throw new NotFoundException(`Local not found`);
    }

    const company = await this.companyService.findOne(
      local.company_id,
      user_id,
    );

    if (!company) {
      throw new NotFoundException(
        `Company not found or belongs to another user`,
      );
    }

    return local;
  }

  async update(updateLocalDto: UpdateLocalDto) {
    const local = await this.localRepository.findOne({
      where: {
        id: updateLocalDto.id,
      },
    });

    if (!local) {
      throw new NotFoundException(`Local not found`);
    }

    const company = await this.companyService.findOne(
      local.company_id,
      updateLocalDto.user_id,
    );

    if (!company) {
      throw new NotFoundException(
        `Company not found or belongs to another user`,
      );
    }

    Object.assign(local, updateLocalDto);

    return this.localRepository.save(local);
  }

  async remove(id: string, user_id: string) {
    const local = await this.localRepository.findOne({ where: { id } });

    if (!local) {
      throw new NotFoundException(`Local not found`);
    }

    const company = await this.companyService.findOne(
      local.company_id,
      user_id,
    );

    if (!company) {
      throw new NotFoundException(
        `Company not found or belongs to another user`,
      );
    }

    return this.localRepository.remove(local);
  }
}
