import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    const userId = req.user.id;
    return this.todoService.create(userId, createTodoDto);
  }

  @Get('uncompleted')
  findUncompleted(@Request() req) {
    const userId = req.user.id;
    return this.todoService.findUncompleted(userId);
  }

  @Get('completed')
  findCompleted(@Request() req) {
    const userId = req.user.id;
    return this.todoService.findcompleted(userId);
  }

  @Patch('markascompleted/:id')
  markAsCompleted(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.todoService.markAsCompleted(id, userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.todoService.remove(id, userId);
  }
}
