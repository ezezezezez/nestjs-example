import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository
  ) {}

  getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  getTaskById(id: number, user: User): Promise<Task> {
    return this.taskRepository.getTaskById(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTaskById(id: number, user: User): Promise<void> {
    return this.taskRepository.deleteTaskById(id, user);
  }

  updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User
  ): Promise<Task> {
    return this.taskRepository.updateTaskById(id, updateTaskDto, user);
  }
}
