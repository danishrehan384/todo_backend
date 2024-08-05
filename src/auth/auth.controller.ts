import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RoleGuard } from './Guards/role.guard';
import { UserRole } from 'utils/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private jwt: JwtService,
    private readonly userService: UsersService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Body() loginDto: LoginDto, @Request() req) {
    return {
      token: this.jwt.sign(req.user),
    };
  }

  @Post('/signup')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Delete('user/delete/id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
