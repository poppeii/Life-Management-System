import { GoalCategory, GoalStatus, Priority } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(GoalCategory) category: GoalCategory;
  @IsOptional() @IsEnum(Priority) priority?: Priority;
  @IsOptional() @IsEnum(GoalStatus) status?: GoalStatus;
  @IsOptional() @IsInt() @Min(0) @Max(100) progress?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() targetDate?: string;
}

export class UpdateGoalDto extends CreateGoalDto {}

export class CreateMilestoneDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateMilestoneDto extends CreateMilestoneDto {
  @IsOptional() @IsString() status?: 'TODO' | 'COMPLETED';
}
