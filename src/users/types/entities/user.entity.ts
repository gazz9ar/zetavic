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
import { Role } from '../roles.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ default: 'google' })
  provider: string;

  @Column()
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: 'normal' })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastLogin?: Date;

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
  role: Role;

  constructor(partial: Partial<SerializedUser>) {
    super();
    Object.assign(this, partial);
  }
}
