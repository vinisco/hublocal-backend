import { Repository } from 'typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthenticateDto } from './dto/authenticate.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto) {
    const user = await this.userRepository.findOne({
      where: { email: authenticateDto.email },
    });

    if (!user) {
      throw new ForbiddenException(`Email or password incorrect`);
    }

    const passwordValid = await bcrypt.compare(
      authenticateDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new ForbiddenException(`Email or password incorrect`);
    }

    const payload = { name: user.name, sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
