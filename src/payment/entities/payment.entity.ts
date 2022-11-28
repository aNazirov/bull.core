export class Payment {
  id: number;
  type: {
    id: number;
    title: string;
  };
  status: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
  };
  summa: number;
  createdAt: Date;
  updatedAt: Date;
}
