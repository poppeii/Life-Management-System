import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() goalId?: string;
  @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
  @IsOptional() @IsEnum(TaskPriority) priority?: TaskPriority;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateTaskDto extends CreateTaskDto {}

export class MoveTaskDto {
  @IsEnum(TaskStatus) status: TaskStatus;
  @IsOptional() @IsInt() order?: number;
}

export class SubtaskDto {
  @IsString() title: string;
  @IsOptional() isCompleted?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class CommentDto {
  @IsString() content: string;
}
