import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { PaginationRequestDto } from '../../common/dto/pagination-request.dto';
import { validate } from '../../common/utils/cnpj.util';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    if (!validate(createCompanyDto.cnpj)) {
      throw new ForbiddenException(`Company CNPJ is not valid`);
    }

    const company = this.companyRepository.create(createCompanyDto);

    return await this.companyRepository.save(company);
  }

  async findAll(user_id: string, paginationRequestDto: PaginationRequestDto) {
    const { page = 1, limit = 10 } = paginationRequestDto;

    const skip = Math.abs(page - 1) * limit;

    const results = await this.companyRepository.find({
      where: {
        user_id: user_id,
      },
      relations: { locals: true },
      skip,
      take: limit,
    });

    const total = await this.companyRepository.count({
      where: {
        user_id: user_id,
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
    const company = await this.companyRepository.findOne({
      where: {
        id: id,
        user_id: user_id,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return company;
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: {
        id: updateCompanyDto.id,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    if (company.user_id !== updateCompanyDto.user_id) {
      throw new ForbiddenException(`Company belongs to another user`);
    }

    if (!validate(updateCompanyDto.cnpj)) {
      throw new ForbiddenException(`Company CNPJ is not valid`);
    }

    Object.assign(company, updateCompanyDto);

    return this.companyRepository.save(company);
  }

  async remove(id: string, user_id: string) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    if (company.user_id !== user_id) {
      throw new ForbiddenException(`Company belongs to another user`);
    }

    return this.companyRepository.remove(company);
  }
}
