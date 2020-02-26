import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginCredentialsDto {
  @IsNotEmpty()
  @ApiProperty({ description: "Log in username." })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Log in password." })
  password: string;
}
