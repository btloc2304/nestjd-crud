import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { LoginBodyDto, LoginResponseDto, RegisterBodyDto, RegisterResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Sử dụng ClassSerializerInterceptor để tuần tự hóa dữ liệu phản hồi
    @SerializeOptions({
        type: RegisterResponseDto,
    })
    // Định nghĩa endpoint POST cho đường dẫn 'register'
    @Post('register')
    register(@Body() body: RegisterBodyDto) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: LoginBodyDto) {
        console.log('Login body:', body);
        return new LoginResponseDto(await this.authService.login(body));
    }
}
