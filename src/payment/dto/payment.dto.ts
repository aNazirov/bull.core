import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  summa: number;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

export class FilterPaymentParams extends PartialType(
  OmitType(CreatePaymentDto, ['summa'] as const),
) {}
