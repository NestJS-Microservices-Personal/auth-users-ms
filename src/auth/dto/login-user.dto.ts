import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @MinLength(8)
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}