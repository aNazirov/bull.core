import { PartialType } from '@nestjs/mapped-types';
import { ContextPriority } from '@prisma/client';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateContextDto {
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

export class UpdateContextDto extends PartialType(CreateContextDto) {}
