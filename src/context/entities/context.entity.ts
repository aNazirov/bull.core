import { ContextPriority } from '@prisma/client';

export class ContextType {
  name: string;
  price: number;
  priority: ContextPriority;
}
