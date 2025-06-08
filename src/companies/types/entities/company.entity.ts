import { Exclude } from 'class-transformer';
import { User } from 'src/users/types/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdat: Date;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}

export class SerializedCompany extends Company {
  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedCompany>) {
    super();
    Object.assign(this, partial);
  }
}
