import { BannerPosition } from '@prisma/client';

export class BannerType {
  name: string;
  size: string;
  price: number;
  index?: number;
  position: BannerPosition;
}
