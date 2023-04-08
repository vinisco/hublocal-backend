import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { AuthenticateDto } from './dto/authenticate.dto';
import genFake from '../../common/utils/genFake.util';
import userMockRepository from '../user/repositories/user-mock.repository';

const userEntityList: User[] = [];

const jwtServiceMock = () => ({
  sign: jest.fn().mockImplementation(() => {
    return 'token';
  }),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: jwtServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userMockRepository(userEntityList),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>('UserRepository');
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('Authenticate', () => {
    it('should return access_token when user is authenticated', async () => {
      const newUser = new User({
        name: genFake.userName(),
        email: genFake.userEmail(),
        password: await bcrypt.hash('password', 10),
      });

      const user = await userRepository.save(newUser);

      const authenticateDto: AuthenticateDto = {
        email: user.email,
        password: 'password',
      };

      const result = await authService.authenticate(authenticateDto);

      expect(result).toEqual({ access_token: 'token' });
    });

    it('should not be able to authenticate with a invalid user', async () => {
      const authenticateDto: AuthenticateDto = {
        email: genFake.userEmail(),
        password: genFake.userPassword(),
      };

      await expect(
        authService.authenticate(authenticateDto),
      ).rejects.toThrowError(
        new ForbiddenException(`Email or password incorrect`),
      );
    });

    it('should not be able to authenticate with a invalid password', async () => {
      const newUser = new User({
        name: genFake.userName(),
        email: genFake.userEmail(),
      });

      newUser.password = await bcrypt.hash('password', 10);

      await userRepository.save(newUser);

      const authenticateDto: AuthenticateDto = {
        email: newUser.email,
        password: genFake.userPassword(),
      };

      await expect(
        authService.authenticate(authenticateDto),
      ).rejects.toThrowError(
        new ForbiddenException(`Email or password incorrect`),
      );
    });
  });
});
