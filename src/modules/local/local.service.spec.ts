import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalService } from './local.service';
import { Local } from './entities/local.entity';
import genFake from '../../common/utils/genFake.util';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';
import { FindAllLocalDto } from './dto/findAll-local.dto';
import localMockRepository from './repositories/local-mock.repository';
import { MockRepository } from 'src/common/types/mock-repository';
import companyMockRepository from '../company/repositories/company-mock.repository';

describe('LocalService', () => {
  let localEntityList: Local[] = [];
  let companyEntityList: Company[] = [];

  let localService: LocalService;
  let companyService: CompanyService;
  let localRepository: MockRepository;
  let companyRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalService,
        {
          provide: getRepositoryToken(Local),
          useValue: localMockRepository(localEntityList),
        },
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: companyMockRepository(companyEntityList),
        },
      ],
    }).compile();

    localService = module.get<LocalService>(LocalService);
    companyService = module.get<CompanyService>(CompanyService);
    localRepository = module.get<MockRepository>(getRepositoryToken(Local));
    companyRepository = module.get<MockRepository>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(localService).toBeDefined();
    expect(companyService).toBeDefined();
    expect(localRepository).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('Create', () => {
    it('should be able to create a new local', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await localService.create(newLocal);

      expect(result).toEqual(newLocal);
      expect(result).toHaveProperty('id');
    });
    it('should not be able to create a new local with a invalid company_id', async () => {
      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: genFake.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(localService.create(newLocal)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('FindAll', () => {
    it('should be able to find all locals related to the user', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await localRepository.save(newLocal);

      const paginatedRequest: FindAllLocalDto = {
        limit: 1,
        page: 1,
        company_id: company.id,
      };

      const result = await localService.findAll(user_id, paginatedRequest);

      expect(result.results.length).toEqual(1);
      expect(result.total).toEqual(1);
      expect(result.limit).toEqual(1);
      expect(result.page).toEqual(1);
    });

    it('should not be able to find all locals with someone else`s company id', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await localRepository.save(newLocal);

      const paginatedRequest: FindAllLocalDto = {
        limit: 1,
        page: 1,
        company_id: genFake.uuid(),
      };

      await expect(
        localService.findAll(user_id, paginatedRequest),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('FindOne', () => {
    it('should be able to find a local related to the user', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      const result = await localService.findOne(local.id, user_id);

      expect(result.id).toEqual(local.id);
      expect(result.company_id).toEqual(local.company_id);
    });
    it('should not be able to find a local with a invalid id', async () => {
      const user_id = genFake.uuid();
      const fakeLocalId = genFake.uuid();

      await expect(
        localService.findOne(fakeLocalId, user_id),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should not be able to find someone else`s local', async () => {
      const user_id = genFake.uuid();
      const user_id_2 = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      await expect(
        localService.findOne(local.id, user_id_2),
      ).rejects.toThrowError(NotFoundException);
    });
  });
  describe('Update', () => {
    it('should be able to update a local', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      const localToUpdate = await localRepository.findOne({
        where: { id: local.id },
      });

      const localUpdate = {
        id: localToUpdate.id,
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        user_id: user_id,
      };

      const result = await localService.update(localUpdate);

      expect(result.id).toEqual(localUpdate.id);
      expect(result.company_id).toEqual(localUpdate.company_id);
      expect(result.name).toEqual(localUpdate.name);
      expect(result.cep).toEqual(localUpdate.cep);
      expect(result.number).toEqual(localUpdate.number);
      expect(result.street).toEqual(localUpdate.street);
      expect(result.neighborhood).toEqual(localUpdate.neighborhood);
      expect(result.city).toEqual(localUpdate.city);
      expect(result.state).toEqual(localUpdate.state);
    });
    // //   it('should not be able to update a local with a invalid id', async () => {
    it(`should not be able to update someone else's local`, async () => {
      const user_id = genFake.uuid();
      const user_id_2 = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      const localToUpdate = await localRepository.findOne({
        where: { id: local.id },
      });

      const localUpdate = {
        id: localToUpdate.id,
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        user_id: user_id_2,
      };

      await expect(localService.update(localUpdate)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('Remove', () => {
    it('should be able to remove a local', async () => {
      const user_id = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      await localService.remove(local.id, user_id);

      const result = await localRepository.find({
        where: { company_id: company.id },
      });

      expect(result.length).toEqual(0);
    });
    it('should not be able to remove a local with a invalid id', async () => {
      const local_id = genFake.uuid();
      const user_id = genFake.uuid();

      await expect(localService.remove(local_id, user_id)).rejects.toThrowError(
        NotFoundException,
      );
    });
    it('should not be able to remove a someone else`s local', async () => {
      const user_id = genFake.uuid();
      const user_id_2 = genFake.uuid();

      const company = new Company({
        created_at: new Date(),
        name: genFake.companyName(),
        cnpj: genFake.companyCNPJ(),
        website: genFake.companyWebsite(),
        user_id,
      });

      await companyRepository.save(company);

      const newLocal = new Local({
        name: genFake.localName(),
        cep: genFake.localCEP(),
        number: genFake.localNumber(),
        street: genFake.localStreet(),
        neighborhood: genFake.localName(),
        city: genFake.localCity(),
        state: genFake.localState(),
        company_id: company.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const local = await localRepository.save(newLocal);

      await expect(
        localService.remove(local.id, user_id_2),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
