import { HabitCategory, HabitFrequency } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateHabitDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(HabitCategory) category: HabitCategory;
  @IsOptional() @IsEnum(HabitFrequency) frequency?: HabitFrequency;
  @IsOptional() @IsInt() @Min(1) targetValue?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() reminderTime?: string;
}

export class UpdateHabitDto extends CreateHabitDto {}

export class CheckInDto {
  @IsOptional() @IsDateString() checkInDate?: string;
  @IsOptional() @IsInt() @Min(0) value?: number;
  @IsOptional() @IsString() note?: string;
}
