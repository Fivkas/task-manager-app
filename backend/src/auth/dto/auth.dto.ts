import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Τι χρειαζόμαστε για εγγραφή
export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

// Τι χρειαζόμαστε για σύνδεση
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
