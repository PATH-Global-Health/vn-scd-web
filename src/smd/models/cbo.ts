interface Location {
  provinceCode: string;
  districtCode: string;
  wardCode: string;
}

interface Account {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}
export interface CBO {
  id: string;
  code: string;
  description: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  website: string;
  phone: string;
  email: string;
  introduction: string;
  isTestingFacility: boolean;
  isPrEPFacility: boolean;
  isARTFacility: boolean;
  logo: string;
  unitTypeId: string;
  projectId: string;
  packageId: string;
  account: Account;
  location?: Location;
  allowInputType: number;
}
