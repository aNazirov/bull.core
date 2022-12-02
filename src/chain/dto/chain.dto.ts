import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class CreateChainDto {
  @IsNumber()
  @Min(0)
  days: number;

  @IsString()
  url: string;

  @IsString()
  title: string;
}

export class CreateChainTypeDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  active: boolean;
}

export class UpdateChainTypeDto extends PartialType(CreateChainTypeDto) {}
