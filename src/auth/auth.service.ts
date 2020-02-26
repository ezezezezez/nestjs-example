import { Injectable } from "@nestjs/common";
import { SignUpCredentialsDto } from "./dto/signup-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { UserRepository } from "../user/user.repository";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.userRepository.addUser(signUpCredentialsDto);
  }

  async logIn(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository.validateCredentials(
      loginCredentialsDto
    );

    const payload: JwtPayloadDto = { userId: user.id };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
