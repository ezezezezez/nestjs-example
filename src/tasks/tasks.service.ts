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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository
  ) {}

  getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto);
  }

  getTaskById(id: number): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTaskById(id: number): Promise<void> {
    return this.taskRepository.deleteTaskById(id);
  }

  updateTaskById(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskRepository.updateTaskById(id, updateTaskDto);
  }
}
