import { IsNotEmpty, IsPositive } from "class-validator";

export class JwtPayloadDto {
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
