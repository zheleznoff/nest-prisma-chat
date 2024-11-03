import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  // Регистрация пользователя
  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль
    const user = await this.usersService.create({
      username: username,
      password: hashedPassword,
    }); // Создаем пользователя
    return this.createToken(user);
  }

  // Вход пользователя
  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createToken(user);
  }

  // Создание JWT токена
  private createToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      username: user.username,
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET
    });
  }
}
