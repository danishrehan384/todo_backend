import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: false,
    nullable: false,
    default: '',
  })
  title: string;

  @Column({
    unique: false,
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    type: Boolean,
  })
  completed: boolean;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date;

  @Column({
    type: 'datetime',
    default: null,
  })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
