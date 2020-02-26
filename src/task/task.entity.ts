import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { User } from "../user/user.entity";
import { ApiHideProperty } from "@nestjs/swagger";

@Entity()
export class Task extends BaseEntity {
  //   @ApiHideProperty()
  @PrimaryGeneratedColumn()
  id: number;

  //   @ApiHideProperty()
  @Column()
  title: string;

  //   @ApiHideProperty()
  @Column()
  description: string;

  //   @ApiHideProperty()
  @Column()
  status: TaskStatus;

  @ApiHideProperty()
  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false }
  )
  user: User;

  @ApiHideProperty()
  @Column()
  userId: number;
}
