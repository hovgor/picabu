import { IsNumber, IsString } from 'class-validator';

export class UploadFileDataDto {
  @IsString()
  path: string[];

  @IsNumber()
  postId: number;
}
