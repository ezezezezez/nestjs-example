import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post("login")
  login(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ) {
    return this.authService.logIn(authCredentialsDto);
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  logOut(@Req() req) {}
}
