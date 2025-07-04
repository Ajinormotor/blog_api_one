import { Column, Entity, OneToMany } from 'typeorm';
import { UserRoles } from '../enum/users.enum';
import { BaseEntity } from 'src/lib/entity/base.entity';
import { Blog } from 'src/blogs/entity/blogs.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @OneToMany(() => Blog, (blog) => blog.author, { cascade: true })
  blogs: Blog[];
}
