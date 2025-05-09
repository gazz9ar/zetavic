import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  room: string;

  @Column({ unique: true })
  externalId: number;

  // todo: add to CSV column
  // @Column({ default: Date.now() })
  // enterDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}

export class SerializedGuest extends Guest {
  @Exclude()
  externalId: number;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<SerializedGuest>) {
    super();
    Object.assign(this, partial);
  }
}
