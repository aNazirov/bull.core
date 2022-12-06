import { PartialType } from '@nestjs/mapped-types';
import { BannerComponent, BannerPosition, BannerSize } from '@prisma/client';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  url: string;

  @IsNumber()
  typeId: number;

  @IsNumber()
  @Min(0)
  days: number;

  @IsNumber()
  posterId: number;
}

export class CreateBannerTypeDto {
  @IsString()
  name: string;

  @IsString({
    groups: [
      BannerSize.size_1200x150,
      BannerSize.size_150x150,
      BannerSize.size_1600x200,
      BannerSize.size_728x90,
      BannerSize.size_160x600,
    ],
  })
  size: BannerSize;

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

  @IsString({
    groups: [
      BannerComponent.header,
      BannerComponent.main,
      BannerComponent.sidebar,
      BannerComponent.footer,
    ],
  })
  component: BannerComponent;
}

export class UpdateBannerTypeDto extends PartialType(CreateBannerTypeDto) {}
