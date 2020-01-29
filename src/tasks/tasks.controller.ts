import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
  ValidationPipe
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./task.entity";

@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    getTasksFilterDto: GetTasksFilterDto
  ): Promise<Task[]> {
    return this.tasksService.getTasks(getTasksFilterDto);
  }

  @Get(":id")
  getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(":id")
  deleteTaskById(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(":id")
  updateTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, updateTaskDto);
  }
}
