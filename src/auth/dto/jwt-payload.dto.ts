import { IsNotEmpty, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class JwtPayloadDto {
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
