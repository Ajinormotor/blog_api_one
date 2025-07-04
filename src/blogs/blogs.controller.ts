import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoles } from 'src/users/enum/users.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthenticatedRequest } from 'src/interface/user-request.interface';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Get()
  allBlogs() {
    return this.blogService.allBlogs();
  }
  @Get(':id')
  singleBlog(@Param('id') id: number) {
    return this.blogService.singleBlog(id);
  }
  @UseGuards(AuthGuard)
  @Post()
  createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.blogService.createBlog(createBlogDto, req.user);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  updateBlog(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  deleteBlog(@Param('id') id: number) {
    return this.blogService.deleteBlog(id);
  }
}
