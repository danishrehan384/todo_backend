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
import { Repository } from 'typeorm';
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

      const getUser = await this.userRepo.findOne({ where: { id } });

      const payload: Todo | any = {
        title: title,
        description: description,
        completed: false,
        user: getUser,
      };

      const createTodo = this.todoRepo.create(payload);
      await this.todoRepo.save(payload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findUncompleted() {
    try {
      return this.todoRepo.find({
        relations: {
          user: true,
        },
        where: {
          completed: false,
          user: {
            id: 4,
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

  findcompleted() {
    try {
      return this.todoRepo.find({
        relations: {
          user: true,
        },
        where: {
          completed: true,
          user: {
            id: 4,
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

  async markAsCompleted(id: number) {
    try {
      const findTodo = await this.todoRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          user: true,
        },
      });

      if (findTodo.user.id != 4)
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

  async remove(id: number) {
    try {
      const findTodo = await this.todoRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          user: true,
        },
      });

      if (findTodo.user.id != 4)
        throw new BadRequestException('this todo not belongs to this user');

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
        message: 'Deleted Successfullyss',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
