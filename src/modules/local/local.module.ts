import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalService } from './local.service';
import { LocalController } from './local.controller';
import { Local } from './entities/local.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Local]), CompanyModule],
  controllers: [LocalController],
  providers: [LocalService],
})
export class LocalModule {}
