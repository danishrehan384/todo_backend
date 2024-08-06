import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'utils/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(body: CreateUserDto) {
    try {
      const { email, firstname, lastname, password } = body;

      const isUserExist = await this.userRepo.findOne({ where: { email } });
      if (isUserExist) throw new BadRequestException('User is already Exist');

      const salt: string = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const payload: User | any = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
      };

      const createUser = this.userRepo.create(payload);
      await this.userRepo.save(createUser);

      return {
        status: 200,
        message: 'User is created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, body: Partial<UpdateUserDto>) {
    try {
      const { email, firstname, lastname, password } = body;
      const isUserExist = await this.userRepo.findOne({
        where: { id: id, deleted_at: IsNull() },
      });
      if (!isUserExist)
        throw new BadRequestException(
          'User not found or may be deleted earlier',
        );
      
      if(isUserExist.role == 'admin') throw new UnauthorizedException;  

      const isEmailAlreadyExist = await this.userRepo
        .createQueryBuilder()
        .where('email = :email AND id != :id', { email, id })
        .getOne();

      if (isEmailAlreadyExist)
        throw new ConflictException('This email is already registerd');

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const payload: User | any = {
          firstname: firstname,
          email: email,
          lastname: lastname,
          password: hash,
        };
        await this.userRepo.update(id, payload);
      } else {
        const payload: User | any = {
          firstname: firstname,
          email: email,
          lastname: lastname,
        };
        await this.userRepo.update(id, payload);
      }

      return {
        status: 200,
        message: 'Updated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const isUserExist = await this.userRepo
        .createQueryBuilder('User')
        .where('deleted_at IS NULL AND id = :id', { id })
        .getOne();

      if (!isUserExist) throw new BadRequestException('User not found');

      if(isUserExist.role == 'admin') throw new UnauthorizedException;

      const deleteUser = await this.userRepo
        .createQueryBuilder('User')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      if (deleteUser.affected) {
        return {
          status: 200,
          message: 'Deleted successfully',
        };
      }

      return {
        status: 400,
        message: 'Something went wrong',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUser() {
    try {
      return this.userRepo.find({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
        },
        relations: {
          todos: true,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createAdmin(body: CreateUserDto) {
    try {
      const { email, firstname, lastname, password } = body;

      const isAdminAlreadyExist = await this.userRepo.findOne({
        where: {
          email: email,
        },
      });
      if (isAdminAlreadyExist)
        throw new BadRequestException('This Email is already exist');

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const payload: User | any = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
        role: UserRole.ADMIN,
      };

      const createAdmin = this.userRepo.create(payload);
      await this.userRepo.save(createAdmin);

      return {
        status: 200,
        message: 'Admin is created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(userid: number) {
    try {
      const isUserExist = await this.userRepo.findOne({
        where: {
          id: userid,
          deleted_at: IsNull(),
        },
      });

      if (!isUserExist) throw new BadRequestException('User not found');

      await this.userRepo
        .createQueryBuilder('user')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :userid', { userid })
        .execute();

      return {
        status: 200,
        message: 'User Deleted Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
