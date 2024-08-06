import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Login')
export class AuthController {
  constructor(private jwt: JwtService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Body() loginDto: LoginDto, @Request() req) {
    return {
      token: this.jwt.sign(req.user),
    };
  }
}
