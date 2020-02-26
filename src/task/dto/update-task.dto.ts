import { IsNotEmpty, IsIn, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ description: "New task title." })
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ description: "New task description." })
  description?: string;

  @IsOptional()
  @IsIn(Object.keys(TaskStatus)) // enum is compiled to object, so it is fine to do this transformation
  @ApiProperty({ description: "New task status." })
  status?: TaskStatus;
}
