import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v1'
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id)
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description, status } = createTaskDto

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: status || TaskStatus.OPEN
    }

    this.tasks.push(task)

    return task
  }

  deleteTaskById(id: string): boolean {
    const TasksNumberBeforeDelete = this.tasks.length

    this.tasks = this.tasks.filter(task => task.id !== id)

    return this.tasks.length === TasksNumberBeforeDelete - 1
  }

  updateTaskById(id: string, body: Partial<CreateTaskDto>): Task {
    const task = this.tasks.find(task => task.id === id)
    
    const {
      title = task.title,
      description = task.description,
      status = task.status
    } = body

    return Object.assign(task, {
      title,
      description,
      status
    })
  }
}
