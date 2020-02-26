import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty({ description: "Title of the task to be created" })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Description of task to be created." })
  description: string;
}
