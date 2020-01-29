import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor (@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {

  }
  // getAllTasks(): Task[] {
  //   return this.tasks
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, q } = filterDto

  //   let tasks = this.tasks

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }

  //   if (q) {
  //     const regex = new RegExp(q, 'i')

  //     tasks = tasks.filter(task => regex.test(task.title) || regex.test(task.description))
  //   }

  //   return tasks
  // }

  async getTaskById (id: number): Promise<TaskEntity> {
    let found
    try {
      found = await this.taskRepository.findOne(id)
    } catch (error) {
      throw new InternalServerErrorException()
    }

    if (!found) {
      throw new NotFoundException()
    }

    return found
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description, status } = createTaskDto

  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: status || TaskStatus.OPEN
  //   }

  //   this.tasks.push(task)

  //   return task
  // }

  // deleteTaskById(id: string): boolean {
  //   const tasks = this.tasks.filter(task => task.id !== id)

  //   const deleted: boolean = tasks.length !== this.tasks.length

  //   if (!deleted) {
  //     throw new NotFoundException()
  //   }

  //   this.tasks = tasks

  //   return true
  // }

  // updateTaskById(id: string, body: Partial<CreateTaskDto>): Task {
  //   const task = this.getTaskById(id)
    
  //   const {
  //     title = task.title,
  //     description = task.description,
  //     status = task.status
  //   } = body

  //   return Object.assign(task, { title, description, status })
  // }
}
