import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/blogs.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/interface/api-response';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CloudinaryConfig } from 'src/cloudinary/cloudinary';
import { User } from 'src/users/entity/users.entity';
import { UploadApiResponse } from 'cloudinary';
import { UpdateBlogDto } from './dto/update-blog-dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly cloudinary: CloudinaryConfig,

    private readonly cacheService: CacheService,
  ) {}

  response<T>(status: number, message: string, payload?: T): ApiResponse<T> {
    return { status, message, payload };
  }

  async createBlog(
    createBlogDto: CreateBlogDto,
    userFromToken: { id: number },
  ) {
    try {
      const { title, content, imageUrl } = createBlogDto;

      if (!title || !content || !imageUrl) {
        return this.response(400, 'Please fill in all fields', null);
      }

      const user = await this.userRepository.findOne({
        where: { id: userFromToken.id },
      });

      if (!user) {
        return this.response(404, 'Author not found', null);
      }

      // console.log('user', user);
      let uploadedImage: UploadApiResponse | null = null;

      if (imageUrl) {
        uploadedImage = await this.cloudinary
          .getCloudinary()
          .uploader.upload(imageUrl, {
            folder: 'crud_one',
          });
      }

      const blog = this.blogRepository.create({
        title,
        content,
        imageUrl: uploadedImage?.secure_url ?? imageUrl,
        author: user,
      });

      await this.blogRepository.save(blog);
      return this.response(201, 'Blog created successfully', blog);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      console.log(error);

      return this.response(500, errorMessage, null);
    }
  }

  async allBlogs() {
    const cacheKey = 'all_blogs';

    const cachedBlog = await this.cacheService.cachedKey(cacheKey);

    if (cachedBlog) {
      return this.response(200, 'Blogs from cache', cachedBlog);
    }
    const blogs = await this.blogRepository.find();

    await this.cacheService.setCache(cacheKey, blogs, 60);

    return this.response(200, '', blogs);
  }

  async singleBlog(id: number) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: ['author'],
      });

      if (!blog) {
        throw new NotFoundException();
      }

      return this.response(200, 'Blog Found', blog);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Sever error';

      return this.response(500, errorMessage, null);
    }
  }

  async updateBlog(id: number, updateBlogDto: UpdateBlogDto) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: ['author'],
      });

      if (!blog) {
        return this.response(404, 'Blog not found', null);
      }

      const { title, content, imageUrl } = updateBlogDto;

      if (!title || !content || !imageUrl) {
        return this.response(400, 'Please fill in all fields', null);
      }

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        return this.response(404, 'Author not found', null);
      }

      let uploadedImage: UploadApiResponse | null = null;

      if (imageUrl) {
        uploadedImage = await this.cloudinary
          .getCloudinary()
          .uploader.upload(imageUrl, {
            folder: 'crud_one',
          });
      }

      blog.title = title;
      blog.content = content;
      blog.imageUrl = uploadedImage?.secure_url ?? imageUrl;
      blog.author = user;

      await this.blogRepository.save(blog);

      return this.response(200, 'Blog updated successfully', blog);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';

      return this.response(500, errorMessage, null);
    }
  }

  async deleteBlog(id: number) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
      });

      if (!blog) {
        throw new NotFoundException();
      }
      await this.blogRepository.delete(id);
      return this.response(200, 'Blog Found', blog);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Sever error';

      return this.response(500, errorMessage, null);
    }
  }
}
