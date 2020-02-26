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
import {
  ApiTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from "@nestjs/swagger";
import { TaskResponseDto } from "./dto/task-response.dto";

@ApiBearerAuth()
@ApiTags("Task")
@Controller("task")
@UseGuards(AuthGuard("jwt"))
export class TaskController {
  private readonly logger: Logger = new Logger("TaskController");

  constructor(private readonly tasksService: TaskService) {}
  // ----- Get all tasks -----
  @ApiOkResponse({
    description: "Successfully getting all tasks.",
    type: [TaskResponseDto]
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized." })
  @Get()
  getTasks(
    @Query(ValidationPipe)
    getTasksFilterDto: GetTasksFilterDto,
    @Req() req
  ): Promise<TaskResponseDto[]> {
    this.logger.verbose(
      `User "${req.user}" retrieving all tasks. Filters: ${JSON.stringify(
        getTasksFilterDto
      )}`
    );
    return this.tasksService.getTasks(getTasksFilterDto, req.user);
  }
  // ----- Get a task -----
  @ApiOkResponse({
    description: "Successfully getting a task.",
    type: TaskResponseDto
  })
  @ApiUnauthorizedResponse({ description: "Unauthorzied." })
  @ApiNotFoundResponse({ description: "Specified task id was not found." })
  @Get(":id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<TaskResponseDto> {
    return this.tasksService.getTaskById(id, req.user);
  }
  // ----- Create a task -----
  @ApiCreatedResponse({
    description: "The task has been successfully created.",
    type: TaskResponseDto
  })
  @ApiUnauthorizedResponse({ description: "Unauthorzied." })
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
  // ----- Delete a task by id -----
  @ApiOkResponse({ description: "The task has been deleted." })
  @ApiUnauthorizedResponse({ description: "Unauthorized." })
  @ApiNotFoundResponse({ description: "Specified task id was not found." })
  @Delete(":id")
  deleteTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, req.user);
  }
  // ----- Update a task by id -----
  @ApiOkResponse({
    description: "The task has been updated.",
    type: TaskResponseDto
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized." })
  @ApiNotFoundResponse({ description: "Specified task id was not found." })
  @Patch(":id")
  updateTaskById(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateTaskDto: UpdateTaskDto,
    @Req() req
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateTaskById(id, updateTaskDto, req.user);
  }
}
