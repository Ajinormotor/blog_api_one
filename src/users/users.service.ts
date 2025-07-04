import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/interface/api-response';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  response<T>(status: number, message: string, payload?: T): ApiResponse<T> {
    return { status, message, payload };
  }

  async allUsers() {
    const users = await this.userRepository.find();
    return this.response(200, '', users);
  }
}
