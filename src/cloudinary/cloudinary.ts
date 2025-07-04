import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

@Injectable()
export class CloudinaryConfig {
  constructor(private readonly configService: ConfigService) {
    const cloud_name = this.configService.get<string>('CLOUD_NAME');
    const api_key = this.configService.get<string>('CLOUD_KEY');
    const api_secret = this.configService.get<string>('CLOUD_SEC');

    if (!cloud_name || !api_key || !api_secret) {
      throw new NotFoundException('Cloudinary configuration not provided');
    }

    const config: ConfigOptions = {
      cloud_name,
      api_key,
      api_secret,
    };

    cloudinary.config(config);
  }

  getCloudinary() {
    return cloudinary;
  }
}
