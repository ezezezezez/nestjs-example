import { IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ description: "Sign up username." })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "password must contain a lowercase letter, an uppercase letter and a number or special character."
  })
  @ApiProperty({ description: "Sign up password." })
  password: string;
}
