import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from 'src/companies/types/entities/company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: 'normal' })
  type: 'superadmin' | 'admin' | 'normal';

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
}

export class SerializedUser extends User {
  @Exclude()
  password: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  isActive: boolean;

  @Exclude()
  type: 'superadmin' | 'admin' | 'normal';

  constructor(partial: Partial<SerializedUser>) {
    super();
    Object.assign(this, partial);
  }
}
