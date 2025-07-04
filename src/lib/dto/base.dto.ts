/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDate, IsUUID } from 'class-validator';

export class BaseDto {
  @IsUUID()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  deletedAt: Date;
}
