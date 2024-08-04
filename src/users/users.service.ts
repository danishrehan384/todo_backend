import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  async update(id: number, body: UpdateUserDto) {
    try {
      const { email, firstname, lastname, password } = body;
      const isUserExist = await this.userRepo.findOne({ where: { id } });
      if (!isUserExist)
        throw new BadRequestException(
          'User not found or may be deleted earlier',
        );

      const isEmailAlreadyExist = await this.userRepo
        .createQueryBuilder()
        .where('email = :email AND id != :id', { email, id })
        .getOne();

      if (isEmailAlreadyExist)
        throw new ConflictException('This email is already registerd');

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const payload: User | any = {
        firstname: firstname,
        email: email,
        lastname: lastname,
        password: hash,
      };

      await this.userRepo.update(id, payload);

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

      await this.userRepo.delete(id);

      return {
        status: 200,
        message: 'Deleted successfully',
      };
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
