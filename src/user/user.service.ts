import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  addUser(user: User): Promise<void> {
    return this.userRepository.addUser(user);
  }
}
