import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly prismaService: PrismaService,
    ) {}
    @Get()
    getPosts() {
        return this.postsService.getPosts();
    }

    @Post()
    async createPost(
        @Body()
        body: {
            title: string;
            content: string;
            authorId: number;
        },
    ) {
        // Check if user exists before creating post
        const userExists = await this.prismaService.user.findUnique({
            where: { id: body.authorId },
        });

        if (!userExists) {
            throw new BadRequestException(
                `User with id ${body.authorId} does not exist`,
            );
        }

        // Use the service method instead of direct prisma call
        return this.postsService.createPost(body);
    }

    @Get(':id')
    getPost(@Param('id') id: string) {
        return this.postsService.getPostById(id);
    }

    @Put(':id')
    updatePost(@Param('id') id: string, @Body() body: any) {
        return this.postsService.updatePost(id, body);
    }

    @Delete(':id')
    deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id);
    }
}
