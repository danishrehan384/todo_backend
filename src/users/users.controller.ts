import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { RoleGuard } from 'src/auth/Guards/role.guard';
import { UserRole } from 'utils/roles.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiSecurity('JWT-auth')
  @Patch()
  update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }

  @ApiSecurity('JWT-auth')
  @Delete()
  remove(@Request() req) {
    const userId = req.user.id;
    return this.usersService.remove(userId);
  }
}
