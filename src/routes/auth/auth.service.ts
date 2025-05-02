import { Injectable } from '@nestjs/common';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { RegisterBodyDto } from './auth.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly hashService: HashingService,
        private readonly prismaService: PrismaService,
    ) {}

    async register(body: RegisterBodyDto) {
        try {
            const hashedPassword = await this.hashService.hash(body.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                },
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}
