import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // @UsePipes(ValidationPipe)
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length > 0) {
  //     return this.tasksService.getTasksWithFilters(filterDto)
  //   }
  //   return this.tasksService.getAllTasks()
  // }
  
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id)
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto)
  // }

  // @Delete(':id')
  // deleteTaskById(@Param('id') id: string): boolean {
  //   return this.tasksService.deleteTaskById(id)
  // }

  // @Patch(':id')
  // updateTaskById(@Param('id') id: string, @Body(TaskStatusValidationPipe) body: Partial<CreateTaskDto>): Task {
  //   return this.tasksService.updateTaskById(id, body)
  // }
}
