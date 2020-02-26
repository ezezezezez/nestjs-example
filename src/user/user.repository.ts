import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { LoginCredentialsDto } from "src/auth/dto/login-credentials.dto";
import { SignUpCredentialsDto } from "src/auth/dto/signup-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async addUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { username, password } = signUpCredentialsDto;
    const user = this.create();
    const SALT_ROUNDS = 10;

    user.username = username;
    user.salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await this.save(user);
    } catch (error) {
      const UNIQUE_USERNAME_CONSTRAINT_VIOLATION = "23505";
      if (error.code === UNIQUE_USERNAME_CONSTRAINT_VIOLATION) {
        throw new ConflictException("username already exists");
      }
      throw new InternalServerErrorException();
    }
  }

  async validateCredentials(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<User> {
    const { username, password } = loginCredentialsDto;

    const user = await this.findOne({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException("Incorrect username or password.");
    }

    return user;
  }
}
