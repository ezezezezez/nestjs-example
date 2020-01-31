import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger("AuthService");

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { password } = authCredentialsDto;

    const user = await this.userRepository.getUserByUsername(
      authCredentialsDto
    );

    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    // TODO: store session, set cookie, redirect
    const { username } = user;

    const payload: JwtPayload = { username };

    const accessToken = await this.jwtService.sign(payload);

    this.logger.debug(`Generated JWT with payload ${JSON.stringify(payload)}`);

    return { accessToken };
  }
}
