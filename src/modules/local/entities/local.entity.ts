import { v4 as uuidV4 } from 'uuid';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { Company } from '../../../modules/company/entities/company.entity';
import genFake from '../../../common/utils/genFake.util';

@Entity('locals')
export class Local {
  @ApiProperty({
    example: genFake.uuid(),
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: genFake.localName(),
  })
  @Column()
  name: string;

  @ApiProperty({
    example: genFake.localCEP(),
  })
  @Column()
  cep: string;

  @ApiProperty({
    example: genFake.localStreet(),
  })
  @Column()
  street: string;

  @ApiProperty({
    example: genFake.localNumber(),
  })
  @Column()
  number: string;

  @ApiProperty({
    example: genFake.localNeighbor(),
  })
  @Column()
  neighborhood: string;

  @ApiProperty({
    example: genFake.localCity(),
  })
  @Column()
  city: string;

  @ApiProperty({
    example: genFake.localState(),
  })
  @Column()
  state: string;

  @ApiProperty({
    example: genFake.uuid(),
  })
  @Column()
  company_id: string;

  @ApiHideProperty()
  @ManyToOne(() => Company, (company) => company.locals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(local: Partial<Local>) {
    if (!this.id) {
      this.id = uuidV4();
    }
    this.name = local?.name;
    this.cep = local?.cep;
    this.number = local?.number;
    this.street = local?.street;
    this.neighborhood = local?.neighborhood;
    this.city = local?.city;
    this.state = local?.state;
    this.company_id = local?.company_id;
    this.created_at = local?.created_at;
    this.updated_at = local?.updated_at;
  }
}
