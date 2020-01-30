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
  NotFoundException
} from "@nestjs/common";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, q } = filterDto;

    const query = this.createQueryBuilder("task");

    if (status !== undefined) {
      query.andWhere("(task.status = :status)", { status });
    }

    if (q !== undefined) {
      query.andWhere("(task.title ILIKE :q OR task.description ILIKE :q)", {
        q: `%${q}%`
      });
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    let task: Task;

    task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = new Task();

    Object.assign(task, { ...createTaskDto, status: TaskStatus.OPEN });

    try {
      await task.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    let result: DeleteResult;

    try {
      result = await Task.delete(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    let result: UpdateResult;

    try {
      result = await Task.update(id, updateTaskDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    try {
      return await this.getTaskById(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
