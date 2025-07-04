import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/interface/api-response';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  response<T>(status: number, message: string, payload?: T): ApiResponse<T> {
    return { status, message, payload };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, password, role } = createUserDto;

      if (!firstName || !lastName || !email || !password || !role) {
        return this.response(400, 'Please fill in all fields', null);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      await this.userRepository.save(user);
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return this.response(201, 'User registered successfully', {
        token: token,
        user: user,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Internal Server Error';
      return this.response(500, message, null);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      if (!email || !password) {
        return this.response(400, 'Please fill in all Field', null);
      }
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return this.response(400, 'Invalid credentials', null);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      //   console.log('USER.PASSWORD (hashed):', user.password);
      //   console.log('LOGIN PASSWORD (plain):', password);
      //   console.log('PASSWORD MATCH:', isMatch);

      if (!isMatch) {
        return this.response(400, 'IPassword Invalid credentials', null);
      }
      const token = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
      );

      return this.response(200, 'Logged in successful', {
        token: token,
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        return this.response(500, error.message, null);
      }

      return this.response(500, 'Internal Server error', null);
    }
  }
}
