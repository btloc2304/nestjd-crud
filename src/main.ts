/* eslint-disable @typescript-eslint/no-floating-promises */
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Sử dụng ValidationPipe để kiểm tra và xử lý dữ liệu đầu vào
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
            forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không có trong DTO,
            transform: true, // Chuyển đổi dữ liệu đầu vào thành kiểu dữ liệu tương ứng với DTO
            transformOptions: {
                enableImplicitConversion: true, // Chuyển đổi kiểu dữ liệu tự động
            },
            exceptionFactory: errors => {
                // Tạo thông báo lỗi tùy chỉnh
                const messages = errors.map(error => {
                    return {
                        field: error.property, // Trường bị lỗi
                        errors: Object.values(error.constraints ?? []).join(', '), // Các lỗi liên quan
                    };
                });
                return new BadRequestException(messages); // Ném ngoại lệ với thông báo lỗi
            },
        }),
    );
    app.useGlobalInterceptors(new LoggingInterceptor()); // Sử dụng LoggingInterceptor toàn cục
    app.useGlobalInterceptors(new TransformInterceptor()); // Sử dụng TransformInterceptor toàn cục
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
