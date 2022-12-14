export interface Hospital {
  // Id: number;
  // Name: string;
  // Image: string;
  // UnitTypeId?: number;
  // Address: string;
  // Email: string;
  // Fax: null;
  // Introduction?: string;
  // Phone: string;
  // Website: string;
  // ProvinceCode: string;
  // DistrictCode: string;
  // WardCode: string;
  // Username: string;
  id: string;
  name: string;
  image?: string;
  unitTypeId?: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  website: string;
  phone: string;
  email: string;
  introduction?: string;
  username: string;
  password: string;
}
