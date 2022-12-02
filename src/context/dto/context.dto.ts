import { PartialType } from '@nestjs/mapped-types';
import { ContextPriority } from '@prisma/client';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateContextDto {
  @IsString()
  url: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  days: number;

  @IsNumber()
  typeId: number;
}

export class CreateContextTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString({
    groups: [
      ContextPriority.low,
      ContextPriority.medium,
      ContextPriority.urgent,
    ],
  })
  priority: ContextPriority;
}

export class UpdateContextTypeDto extends PartialType(CreateContextTypeDto) {}
