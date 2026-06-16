import { Mood } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class JournalDto {
  @IsDateString() entryDate: string;
  @IsOptional() @IsEnum(Mood) mood?: Mood;
  @IsOptional() @IsString() whatWentWell?: string;
  @IsOptional() @IsString() whatCanImprove?: string;
  @IsOptional() @IsString() tomorrowFocus?: string;
  @IsOptional() @IsString() gratitude?: string;
  @IsOptional() @IsString() note?: string;
}
