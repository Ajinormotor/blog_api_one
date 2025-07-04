import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_EV ?? 'development',
  apiPrefix: process.env.API_PREFIX ?? 'api',
  port: parseInt(process.env.PORT ?? '3000', 10),
}));
