import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // --- REGISTER LOGIC ---
  async register(dto: RegisterDto) {
    // 1. Check if the email already exists
    const existingUser = await this.usersService.findOne(dto.email);
    if (existingUser) throw new ConflictException('User already exists');

    // 2. Password hashing (SALT rounds = 10)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Save to database
    const user = await this.usersService.createUser({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });

    // 4. Return message (without the code!)
    return { message: 'User registered successfully', userId: user.id };
  }

  // --- LOGIN LOGIC ---
  async login(dto: LoginDto) {
    // 1. Find the user
    const user = await this.usersService.findOne(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Compare the codes (Plain text vs Hashed)
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate JWT Token
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username
    };
  }
}