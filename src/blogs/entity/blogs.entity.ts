import { User } from 'src/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  author: User;
}
