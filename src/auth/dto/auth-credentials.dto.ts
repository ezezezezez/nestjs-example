import { IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "password must contain a lowercase letter, an uppercase letter and a number or special character."
  })
  password: string;
}
