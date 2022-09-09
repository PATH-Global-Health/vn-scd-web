export interface Customer {
  readonly id: string;
  // readonly Id?: number;
  fullname: string;
  phone?: string;
  phoneNumber: string;
  gender: boolean;
  dateOfBirth?: string;
  email?: string;
  address?: string;
  district?: string;
  province?: string;
  ward?: string;
  districtCode?: string;
  provinceCode?: string;
  wardCode?: string;
  birthDate?: string;
}

export type CustomerCM = Omit<Customer, 'id'>;
