import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse
} from "@nestjs/swagger";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { SignUpCredentialsDto } from "./dto/signup-credentials.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // ----- Sign up -----
  @Post("signup")
  @ApiCreatedResponse({ description: "Sign up successfully." })
  @ApiBadRequestResponse({
    description: "Your credentials did not meet the required format."
  })
  @ApiConflictResponse({ description: "Username already exists." })
  signUp(
    @Body(ValidationPipe)
    signUpCredentialsDto: SignUpCredentialsDto
  ): Promise<void> {
    return this.authService.signUp(signUpCredentialsDto);
  }
  // ----- Log in -----
  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({ description: "Login successfully.", type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: "Incorrect username or password." })
  login(
    @Body(ValidationPipe)
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<LoginResponseDto> {
    return this.authService.logIn(loginCredentialsDto);
  }
}
