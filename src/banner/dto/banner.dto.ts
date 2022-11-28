import { PartialType } from '@nestjs/mapped-types';
import { BannerPosition } from '@prisma/client';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  name: string;

  @IsString()
  size: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Max(100)
  @Min(0)
  index: number;

  @IsString({
    groups: [BannerPosition.full, BannerPosition.left, BannerPosition.right],
  })
  position: BannerPosition;
}

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
