import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "../task-status.enum";

export class TaskResponseDto {
  @ApiProperty({ description: "Task title." })
  title: string;

  @ApiProperty({ description: "Task description." })
  description: string;

  @ApiProperty({ description: "Task status." })
  status: TaskStatus;
}
