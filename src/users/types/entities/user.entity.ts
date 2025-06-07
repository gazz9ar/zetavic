import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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
