import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus)) // enum is compiled to object, so it is fine to do this transformation
  @ApiProperty({ description: "Task status filter." })
  status?: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: "search key for task title or task description."
  })
  q?: string;
}
