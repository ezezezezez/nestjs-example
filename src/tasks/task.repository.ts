import {
  Repository,
  EntityRepository,
  DeleteResult,
  UpdateResult,
  Like
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
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private readonly logger: Logger = new Logger("TaskRepository");

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, q } = filterDto;

    const query = this.createQueryBuilder("task");

    query.where("(task.userId = :userId)", { userId: user.id });

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
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    let task: Task;

    task = await this.findOne({
      where: {
        id,
        userId: user.id
      }
    });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = new Task();

    Object.assign(task, { ...createTaskDto, status: TaskStatus.OPEN, user });

    try {
      await task.save();

      delete task.user;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${
          user.username
        }". Data: ${JSON.stringify(createTaskDto)}`,
        error.stack
      );

      throw new InternalServerErrorException();
    }

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    let result: DeleteResult;

    try {
      result = await Task.delete({ id, userId: user.id });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User
  ): Promise<Task> {
    let result: UpdateResult;
    try {
      result = await Task.update({ id, userId: user.id }, updateTaskDto);
    } catch (error) {
      this.logger.error(
        `Failed to update the task for user "${
          user.username
        }". Data: ${JSON.stringify(updateTaskDto)}`
      );

      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    try {
      return await this.getTaskById(id, user);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
