import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isNotFoundError, isUniqueConstraintError } from '../../shared/helpers';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../../shared/services/token.service';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly hashService: HashingService,
        private readonly prismaService: PrismaService,
        private readonly tokenService: TokenService
    ) {}

    async register(body: RegisterBodyDto): Promise<any> {
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
            if (isUniqueConstraintError(error)) {
                throw new UnauthorizedException([
                    {
                        field: 'email',
                        message: 'Email already exists',
                    },
                ]);
            }
            console.error('Error creating user:', error);
        }
    }

    async login(body: LoginBodyDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email: body.email },
            });
            if (!user) {
                throw new UnauthorizedException([
                    {
                        field: 'email',
                        message: 'User not found',
                    },
                ]);
            }
            const isPasswordValid = await this.hashService.compare(body.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException([
                    {
                        field: 'password',
                        message: 'Invalid password',
                    },
                ]);
            }
            const tokens = await this.generateTokens({ userId: user.id });
            return tokens;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error; // Re-throw the error to ensure the function does not return undefined
        }
    }

    async generateTokens(payload: {
        userId: number;
    }): Promise<{ accessToken: string; refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload),
        ]);

        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
        await this.prismaService.refreshToken.create({
            data: {
                userId: payload.userId,
                token: refreshToken,
                expiresAt: new Date(decodedRefreshToken.exp * 1000), // Use exp from decoded token
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(refreshToken: string): Promise<any> {
        try {
            // Kiểm tra xem refresh token có hợp lệ không
            const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);
            // Kiểm tra xem refresh token có tồn tại trong cơ sở dữ liệu không
            await this.prismaService.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            // Xóa refresh token cũ
            await this.prismaService.refreshToken.delete({
                where: { token: refreshToken },
            });
            // Tạo mới access token và refresh token
            return this.generateTokens({ userId: userId });
        } catch (error) {
            // Nếu refresh token không còn tồn tại trong cơ sở dữ
            // Thông báo lỗi
            if (isNotFoundError(error)) {
                // Token không tồn tại trong cơ sở dữ liệu
                throw new UnauthorizedException([
                    {
                        field: 'refreshToken',
                        message: 'Refresh token not found',
                    },
                ]);
            }

            throw new UnauthorizedException([
                {
                    field: 'refreshToken',
                    message: 'Refresh token invalid',
                },
            ]);
        }
    }

    async logout(refreshToken: string): Promise<any> {
        try {
            // Kiểm tra xem refresh token có hợp lệ không
            await this.tokenService.verifyRefreshToken(refreshToken);
            // Xóa refresh token cũ
            await this.prismaService.refreshToken.delete({
                where: { token: refreshToken },
            });
            // Trả về thông báo thành công
            return {
                message: 'Logout successful',
            };
        } catch (error) {
            // Nếu refresh token không còn tồn tại trong cơ sở dữ
            // Thông báo lỗi
            if (isNotFoundError(error)) {
                // Token không tồn tại trong cơ sở dữ liệu
                throw new UnauthorizedException([
                    {
                        field: 'refreshToken',
                        message: 'Refresh token not found',
                    },
                ]);
            }

            throw new UnauthorizedException([
                {
                    field: 'refreshToken',
                    message: 'Refresh token invalid',
                },
            ]);
        }
    }
}
