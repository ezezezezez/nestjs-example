import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    const { status } = value

    if (status !== undefined && !(status in TaskStatus)) {
      throw new BadRequestException('invalid status value')
    }

    return value
  }
}