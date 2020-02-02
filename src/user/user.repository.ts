import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async addUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
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
    authCredentialsDto: AuthCredentialsDto
  ): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
