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
  ValidationPipe,
  UseGuards,
  Logger
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/user.entity";
import { GetUser } from "src/auth/get-user.decorator";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger: Logger = new Logger("TaskController");

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    getTasksFilterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        getTasksFilterDto
      )}`
    );
    return this.tasksService.getTasks(getTasksFilterDto, user);
  }

  @Get(":id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
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
    createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto
      )}`
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(":id")
  deleteTaskById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
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
    updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, updateTaskDto, user);
  }
}
