import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post("/:id")
  create(@Param('id') id: number, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(id, createTodoDto);
  }

  @Get("uncompleted")
  findUncompleted() {
    return this.todoService.findUncompleted();
  }

  @Get("completed")
  findCompleted() {
    return this.todoService.findcompleted();
  }

  @Patch('markascompleted/:id')
  markAsCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.markAsCompleted(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
