import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() sort?: string;
}
