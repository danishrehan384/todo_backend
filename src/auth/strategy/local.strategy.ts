import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: {
        email: email,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new UnauthorizedException('Invalid Email Address');

    const decryptPassword = await bcrypt.compare(password, user.password);

    if (!decryptPassword) throw new UnauthorizedException('Invalid Password');

    const payload: any = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    };

    return payload;
  }
}