interface Account {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  allowInputType: number | string;
  description: string;
  account: Account;
}
