import {
  Repository,
  EntityRepository,
  DeleteResult,
  UpdateResult
} from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import {
  InternalServerErrorException,
  NotFoundException,
  Logger
} from "@nestjs/common";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private readonly logger: Logger = new Logger("TaskRepository");

  async getTasks(
    filterDto: GetTasksFilterDto,
    userId: number
  ): Promise<Task[]> {
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
