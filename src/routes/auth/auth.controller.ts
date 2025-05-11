import { Body, Controller, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../shared/guards/access-token.guard';
import {
    LoginBodyDto,
    LoginResponseDto,
    RefreshTokenBodyDto,
    RefreshTokenResponseDto,
    RegisterBodyDto,
    RegisterResponseDto,
} from './auth.dto';
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
        return new LoginResponseDto(await this.authService.login(body));
    }

    @UseGuards(AccessTokenGuard)
    @Post('refresh-token')
    async refreshToken(@Body() body: RefreshTokenBodyDto) {
        return new RefreshTokenResponseDto(await this.authService.refreshToken(body.refreshToken));
    }
}
