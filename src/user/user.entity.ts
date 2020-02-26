import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Task } from "../task/task.entity";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity()
@Unique("unique_username_constraint", ["username"])
export class User extends BaseEntity {
  //   @ApiHideProperty()
  @PrimaryGeneratedColumn()
  id: number;

  //   @ApiHideProperty()
  @Column()
  username: string;

  //   @ApiHideProperty()
  @Column()
  password: string;

  //   @ApiHideProperty()
  @Column()
  salt: string;

  @ApiHideProperty()
  @OneToMany(
    type => Task,
    task => task.user,
    {
      eager: true
    }
  )
  tasks: Task[];

  // @ApiHideProperty()
  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.password;
  }
}
