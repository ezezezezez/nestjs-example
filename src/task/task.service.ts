import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TaskRepository
  ) {}

  getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    userId: number
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, userId);
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId
      }
    });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, userId);
  }

  async deleteTaskById(id: number, userId: number): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number
  ): Promise<Task> {
    const task = await this.getTaskById(id, userId);
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.status = updateTaskDto.status;
    await task.save();
    return task;
  }
}
