import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateChainDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  active: boolean;
}

export class UpdateChainDto extends PartialType(CreateChainDto) {}
