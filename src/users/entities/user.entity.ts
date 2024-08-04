import { Todo } from 'src/todo/entities/todo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: false,
    nullable: false,
    default: '',
  })
  firstname: string;

  @Column({
    unique: false,
    nullable: false,
    default: '',
  })
  lastname: string;

  @Column({
    unique: true,
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    unique: false,
    nullable: false,
    default: '',
  })
  password: string;

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

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
