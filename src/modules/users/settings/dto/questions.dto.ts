import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuestionsDto {
  @ApiProperty()
  userId: number;
  @ApiPropertyOptional()
  text?: string;
}
