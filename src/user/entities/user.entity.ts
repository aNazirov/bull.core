export class User {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  };
  subUsers: {
    id: number;
    name: string;
    ageRemark?: number;
    contact: Contact;
  }[];
  contact: Contact;
  role: Role;
  balance?: number;
  ageRemark?: number;
  lastSubscription: any;
}

export class Role {
  id: number;
  title: string;
}

export class Contact {
  email: string;
}
