import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { PostsModule } from './routes/posts/posts.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [PostsModule, SharedModule, AuthModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR, // Đăng ký ClassSerializerInterceptor toàn cục
            useClass: ClassSerializerInterceptor, // Sử dụng ClassSerializerInterceptor
        },
    ],
})
export class AppModule {}
