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
  Logger,
  Req
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("task")
@UseGuards(AuthGuard("jwt"))
export class TaskController {
  private readonly logger: Logger = new Logger("TaskController");

  constructor(private readonly tasksService: TaskService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe)
    getTasksFilterDto: GetTasksFilterDto,
    @Req() req
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${req.user}" retrieving all tasks. Filters: ${JSON.stringify(
        getTasksFilterDto
      )}`
    );
    return this.tasksService.getTasks(getTasksFilterDto, req.user);
  }

  @Get(":id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @Req() req
  ): Promise<Task> {
    this.logger.verbose(
      `User "${req.user}" creating a new task. Data: ${JSON.stringify(
        createTaskDto
      )}`
    );
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Delete(":id")
  deleteTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, req.user);
  }

  @Patch(":id")
  updateTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateTaskDto: UpdateTaskDto,
    @Req() req
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, updateTaskDto, req.user);
  }
}
