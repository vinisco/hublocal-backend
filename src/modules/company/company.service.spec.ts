import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import genFake from '../../common/utils/genFake.util';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { MockRepository } from 'src/common/types/mock-repository';
import companyMockRepository from './repositories/company-mock.repository';

describe('CompanyService', () => {
  let companyEntityList: Company[] = [];

  let companyService: CompanyService;
  let companyRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: companyMockRepository(companyEntityList),
        },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<MockRepository>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('Create', () => {
    it('should be able to create a new company', async () => {
      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
      });

      const result = await companyService.create(newCompany);

      expect(result).toEqual(newCompany);
      expect(result).toHaveProperty('id');
    });
    it('should not be able to create a new company with a invalid CNPJ', async () => {
      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: 'invalid',
        website: genFake.companyWebsite(),
      });

      await expect(companyService.create(newCompany)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
  describe('FindAll', () => {
    it('should be able to find all companies related to the user', async () => {
      const user_id = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(newCompany);

      const paginatedRequest: PaginationRequestDto = {
        limit: 1,
        page: 1,
      };

      const result = await companyService.findAll(user_id, paginatedRequest);

      expect(result.results.length).toEqual(1);
      expect(result.total).toEqual(1);
      expect(result.limit).toEqual(1);
      expect(result.page).toEqual(1);
    });
  });
  describe('FindOne', () => {
    it('should be able to find a company related to the user', async () => {
      const user_id = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      const result = await companyService.findOne(company.id, user_id);

      expect(result.id).toEqual(company.id);
      expect(result.user_id).toEqual(company.user_id);
    });
    it('should not be able to find a company with a invalid id', async () => {
      const user_id = genFake.uuid();
      const fakeCompanyId = genFake.uuid();

      await expect(
        companyService.findOne(fakeCompanyId, user_id),
      ).rejects.toThrowError(NotFoundException);
    });
  });
  describe('Update', () => {
    it('should be able to update a company', async () => {
      const user_id = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      const updateCompany: UpdateCompanyDto = {
        id: company.id,
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id: user_id,
      };

      const result = await companyService.update(updateCompany);

      expect(result.id).toEqual(updateCompany.id);
      expect(result.user_id).toEqual(updateCompany.user_id);
      expect(result.name).toEqual(updateCompany.name);
      expect(result.website).toEqual(updateCompany.website);
      expect(result.cnpj).toEqual(updateCompany.cnpj);
    });
    it('should not be able to update a company with a invalid id', async () => {
      const user_id = genFake.uuid();

      const updateCompany: UpdateCompanyDto = {
        id: 'invalid',
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id: user_id,
      };

      await expect(companyService.update(updateCompany)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it(`should not be able to update someone else's company`, async () => {
      const user_id = genFake.uuid();
      const user_id_2 = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      const updateCompany: UpdateCompanyDto = {
        id: company.id,
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id: user_id_2,
      };
      await expect(companyService.update(updateCompany)).rejects.toThrowError(
        ForbiddenException,
      );
    });
    it(`should not be able to update a company with a invalid CNPJ`, async () => {
      const user_id = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      const updateCompany: UpdateCompanyDto = {
        id: company.id,
        name: genFake.companyName(),
        cnpj: 'invalid',
        website: genFake.companyWebsite(),
        user_id: user_id,
      };
      await expect(companyService.update(updateCompany)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
  describe('Remove', () => {
    it('should be able to delete a company', async () => {
      const user_id = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      await companyService.remove(company.id, user_id);

      const result = await companyRepository.find({ where: { user_id } });

      expect(result.length).toEqual(0);
    });
    it('should not be able to remove a company with a invalid id', async () => {
      const user_id = genFake.uuid();
      const fakeCompanyId = genFake.uuid();

      await expect(
        companyService.remove(fakeCompanyId, user_id),
      ).rejects.toThrowError(NotFoundException);
    });
    it(`should not be able to remove someone else's company`, async () => {
      const user_id = genFake.uuid();
      const user_id_2 = genFake.uuid();

      const newCompany = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      const company = await companyRepository.save(newCompany);

      await expect(
        companyService.remove(company.id, user_id_2),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
