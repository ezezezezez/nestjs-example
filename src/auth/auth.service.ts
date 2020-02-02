import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { UserRepository } from "../user/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.addUser(authCredentialsDto);
  }

  async logIn(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.userRepository.validateCredentials(
      authCredentialsDto
    );

    const payload: JwtPayloadDto = { userId: user.id };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
