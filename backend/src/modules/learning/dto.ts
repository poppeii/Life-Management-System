import { LearningCategory, LearningStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateLearningItemDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(LearningCategory) category: LearningCategory;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsEnum(LearningStatus) status?: LearningStatus;
  @IsOptional() @IsInt() @Min(0) @Max(100) progress?: number;
  @IsOptional() @IsNumber() totalHours?: number;
  @IsOptional() @IsNumber() completedHours?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() targetDate?: string;
}

export class UpdateLearningItemDto extends CreateLearningItemDto {}

export class StudyLogDto {
  @IsString() topic: string;
  @IsInt() durationMinutes: number;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() studiedAt?: string;
}
