export class User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  balance?: number;
}

export class Role {
  id: number;
  title: string;
}
