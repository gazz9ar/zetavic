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
  username: string;

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
  createdat: Date;
}

export class SerializedUser extends User {
  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedUser>) {
    super();
    Object.assign(this, partial);
  }
}
