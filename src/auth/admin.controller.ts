import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RoleGuard } from './Guards/role.guard';
import { UserRole } from 'utils/roles.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Get('users/find/all')
  @UseGuards(new RoleGuard(UserRole.ADMIN))
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Delete('user/delete/id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
