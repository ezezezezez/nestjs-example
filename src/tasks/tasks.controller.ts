import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks()
  }
  
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id)
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto)
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): boolean {
    return this.tasksService.deleteTaskById(id)
  }

  @Patch(':id')
  updateTaskById(@Param('id') id: string, @Body() body: Partial<CreateTaskDto>): Task {
    return this.tasksService.updateTaskById(id, body)
  }
}
