import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepo: Repository<Todo>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(id: number, body: CreateTodoDto) {
    try {
      const { description, title } = body;

      const user = await this.userRepo.findOne({ where: { id } });

      const payload: Todo | any = {
        title: title,
        description: description,
        completed: false,
        user: user,
      };

      const createTodo = this.todoRepo.create(payload);
      const save = await this.todoRepo.save(payload);

      return {
        id: save.id,
        title: save.title,
        description: save.description,
        completed: save.completed,
        created_at: save.created_at,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findUncompleted(userId: number) {
    try {
      return this.todoRepo.find({
        relations: {
          user: true,
        },
        where: {
          completed: false,
          deleted_at: IsNull(),
          user: {
            id: userId,
          },
        },
        select: {
          title: true,
          description: true,
          completed: true,
          created_at: true,
          user: {
            id: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findcompleted(userId: number) {
    try {
      return this.todoRepo.find({
        relations: {
          user: true,
        },
        where: {
          completed: true,
          deleted_at: IsNull(),
          user: {
            id: userId,
          },
        },
        select: {
          title: true,
          description: true,
          completed: true,
          created_at: true,
          user: {
            id: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markAsCompleted(id: number, userId: number) {
    try {
      const findTodo = await this.todoRepo.findOne({
        where: {
          id: id,
          user: {
            id: userId,
          },
        },
      });

      if (!findTodo)
        throw new BadRequestException('this todo not belongs to this user');

      await this.todoRepo
        .createQueryBuilder('todo')
        .update()
        .set({
          completed: true,
        })
        .where('id = :id AND deleted_at IS NULL', { id })
        .execute();

      return {
        status: HttpStatus.OK,
        message: 'Mark as completed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const findTodo = await this.todoRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
          user: {
            id: userId,
          },
        },
      });

      if (!findTodo) throw new BadRequestException();

      await this.todoRepo
        .createQueryBuilder('todo')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return {
        status: HttpStatus.OK,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
