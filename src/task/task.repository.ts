import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse
} from "@nestjs/swagger";
import { TaskResponseDto } from "./dto/task-response.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private readonly logger: Logger = new Logger("TaskRepository");

  async getTasks(
    filterDto: GetTasksFilterDto,
    userId: number
  ): Promise<TaskResponseDto[]> {
    const { status, q } = filterDto;

    const query = this.createQueryBuilder("task");

    query.where("(task.userId = :userId)", { userId });

    if (status !== undefined) {
      query.andWhere("(task.status = :status)", { status });
    }

    if (q !== undefined) {
      query.andWhere("(task.title ILIKE :q OR task.description ILIKE :q)", {
        q: `%${q}%`
      });
    }

    try {
      const tasks = await query.getMany();
      for (const task of tasks) {
        delete task.user;
        delete task.userId;
      }
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${userId}", Filters: ${JSON.stringify(
          filterDto
        )}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: number
  ): Promise<Task> {
    const task: Task = new Task();

    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.status = TaskStatus.OPEN;
    task.userId = userId;

    try {
      await task.save();

      delete task.userId;
      delete task.user;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${userId}". Data: ${JSON.stringify(
          createTaskDto
        )}`,
        error.stack
      );

      throw new InternalServerErrorException();
    }

    return task;
  }
}
