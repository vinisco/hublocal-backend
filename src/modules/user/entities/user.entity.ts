import { v4 as uuidV4 } from 'uuid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import genFake from '../../../common/utils/genFake.util';
import { Company } from '../../company/entities/company.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: genFake.uuid(),
    description: `User email`,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: genFake.userName(),
    description: `User email`,
  })
  @Column()
  name: string;

  @ApiProperty({
    example: genFake.userEmail(),
    description: `User email`,
  })
  @Column()
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @ApiHideProperty()
  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = await bcrypt.hash(password || this.password, 10);
  }

  constructor(user: Partial<User>) {
    if (!this.id) {
      this.id = uuidV4();
    }
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.created_at = user?.created_at;
  }
}
