import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @MessagePattern({ cmd: 'auth.login.user' })
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto.email, loginUserDto.password);
  }

  @MessagePattern({ cmd: 'auth.register.user' })
  async registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern({ cmd: 'auth.validate.user' })
  async verifiToken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}
