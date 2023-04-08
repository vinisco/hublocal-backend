import { v4 as uuidV4 } from 'uuid';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../../modules/user/entities/user.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import genFake from '../../../common/utils/genFake.util';
import { Local } from '../../../modules/local/entities/local.entity';

@Entity('companies')
export class Company {
  @ApiProperty({
    example: genFake.uuid(),
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: genFake.companyName(),
  })
  @Column()
  name: string;

  @ApiProperty({
    example: genFake.companyWebsite(),
  })
  @Column()
  website: string;

  @ApiProperty({
    example: genFake.companyCNPJ(),
  })
  @Column()
  cnpj: string;

  @ApiProperty({
    example: genFake.uuid(),
  })
  @Column()
  user_id: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiHideProperty()
  @OneToMany(() => Local, (local) => local.company, { onDelete: 'CASCADE' })
  locals: Local[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(company: Partial<Company>) {
    if (!this.id) {
      this.id = uuidV4();
    }
    this.name = company?.name;
    this.website = company?.website;
    this.cnpj = company?.cnpj;
    this.user_id = company?.user_id;
    this.created_at = company?.created_at;
    this.updated_at = company?.updated_at;
  }
}
