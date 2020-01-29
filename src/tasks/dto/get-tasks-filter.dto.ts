import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus)) // enum is compiled to object, so it is fine to do this transformation
  status: TaskStatus

  @IsOptional()
  @IsNotEmpty()
  q: string
}