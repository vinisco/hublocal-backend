import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import genFake from '../../common/utils/genFake.util';
import { MockRepository } from 'src/common/types/mock-repository';
import userMockRepository from './repositories/user-mock.repository';

describe('UserService', () => {
  const userEntityList: User[] = [];

  let userService: UserService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userMockRepository(userEntityList),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('should be able to create a new user', async () => {
      const freshNewUserEntity = new User({
        created_at: new Date(),
        name: genFake.userName(),
        email: genFake.userEmail(),
        password: genFake.userPassword(),
      });

      const result = await userService.create(freshNewUserEntity);

      expect(result).toEqual(freshNewUserEntity);
      expect(result).toHaveProperty('id');
    });
    it('should not be able to create a new user with a the same email', async () => {
      const newUserEntity = new User({
        created_at: new Date(),
        name: genFake.userName(),
        email: 'mailTest@test.com',
        password: genFake.userPassword(),
      });

      await userService.create(newUserEntity);

      await expect(userService.create(newUserEntity)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
});
