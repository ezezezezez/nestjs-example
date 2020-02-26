import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({ description: "Bearer Token." })
  accessToken: string;
}
