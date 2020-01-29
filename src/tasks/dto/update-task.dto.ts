import { IsNotEmpty, IsIn, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsIn(Object.keys(TaskStatus)) // enum is compiled to object, so it is fine to do this transformation
  status: TaskStatus;
}
