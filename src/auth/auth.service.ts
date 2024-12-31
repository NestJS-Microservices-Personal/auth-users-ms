import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService
  ) {
    super()
  }

  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database MongoDB');

  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { password, name, email } = registerUserDto;

    const user = await this.getUserByEmail(email);

    if (user)
      throw new RpcException(
        {
          status: 400,
          message: 'User already registered'
        }
      );

    const newUser = await this.user.create({
      data: {
        password: bcrypt.hashSync(password, 10),
        name,
        email
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.user.findFirst({
      where: {
        email
      }
    });
    if (!user)
      throw new RpcException({
        status: 404,
        message: 'User not registered'
      });

    return user;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.getUserByEmail(email);
    
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials'
      });

    const { password: _, ...userWithoutPassword } = user;

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      message: 'User logged in successfully',
      user: userWithoutPassword,
      token
    };
  }


  async verifyToken(token: string) {
    try {
      const {sub, iat, exp, ...user} = this.jwtService.verify(token,
        {
          secret: envs.jwtSecret
        }
      );
      return {
        user,
        token: this.jwtService.sign(user)
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token'
      });
    }
  }
}
