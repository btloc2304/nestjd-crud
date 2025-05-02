import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class PostsService {
    constructor(private readonly prismaService: PrismaService) {}

    getPosts() {
        return this.prismaService.post.findMany();
    }

    async createPost(post: { title: string; content: string; authorId: number }) {
        // Check if user exists before creating post
        const userExists = await this.prismaService.user.findUnique({
            where: { id: post.authorId },
        });

        if (!userExists) {
            throw new BadRequestException(`User with id ${post.authorId} does not exist`);
        }

        return this.prismaService.post.create({
            data: {
                title: post.title,
                content: post.content,
                authorId: post.authorId,
            },
        });
    }

    getPostById(id: string) {
        return this.prismaService.post.findUnique({
            where: { id: Number(id) },
        });
    }

    async updatePost(id: string, post: { title: string; content: string; authorId: number }) {
        // Check if user exists before updating post
        const userExists = await this.prismaService.user.findUnique({
            where: { id: post.authorId },
        });

        if (!userExists) {
            throw new BadRequestException(`User with id ${post.authorId} does not exist`);
        }

        return this.prismaService.post.update({
            where: { id: Number(id) },
            data: {
                title: post.title,
                content: post.content,
                authorId: post.authorId,
            },
        });
    }

    deletePost(id: string) {
        return this.prismaService.post.delete({
            where: { id: Number(id) },
        });
    }

    async ensureUserExists(userId: number) {
        return this.prismaService.user
            .findUnique({
                where: { id: userId },
            })
            .then(user => {
                if (!user) {
                    throw new BadRequestException(`User with id ${userId} does not exist`);
                }
            });
    }
}
