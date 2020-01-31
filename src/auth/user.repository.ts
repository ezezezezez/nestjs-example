import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import {
  InternalServerErrorException,
  ConflictException,
  NotFoundException
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = new User();

    user.username = authCredentialsDto.username;

    const SALT_ROUNDS = 10;

    try {
      user.salt = await bcrypt.genSalt(SALT_ROUNDS);

      user.password = await bcrypt.hash(authCredentialsDto.password, user.salt);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    try {
      await user.save();
    } catch (error) {
      const UNIQUE_USERNAME_CONSTRAINT_VIOLATION = "23505";

      if (error.code === UNIQUE_USERNAME_CONSTRAINT_VIOLATION) {
        throw new ConflictException("username already exists");
      }

      throw new InternalServerErrorException();
    }
  }

  async getUserByUsername(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<User> {
    const { username } = authCredentialsDto;

    let user: User;

    user = await this.findOne({ username });

    if (!user) {
      throw new NotFoundException("Invalid credentials");
    }

    return user;
  }
}
