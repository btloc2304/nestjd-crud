import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}
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
        // Delegate user existence check to the service
        await this.postsService.ensureUserExists(body.authorId);
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
