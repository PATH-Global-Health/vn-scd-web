import { Hospital } from "@admin/manage-account/models/hospital";

export interface Doctor {
  isDeleted: boolean;
  userName: string;
  password: string;
  id: string;
  code: string;
  email: string;
  gender: boolean;
  identityCard: string;
  fullName: string;
  phone: string;
  title: string;
  academicTitle: string;
  description?: string;
  // Degree: string;
  // TypeId: number;
  // Type: string;
  // Username: string;
}

// export interface DoctorCM extends Omit<Doctor, 'Id' | 'Type'> {
//   Password: string;
// }
export type DoctorCM = Omit<Doctor, 'id'>;

// export type DoctorUM = Omit<Doctor, 'Type' | 'Username'>;

export const doctorType: {
  [key: number]: string;
} = {
  1: 'Bác sĩ',
  2: 'Điều dưỡng',
  3: 'Kỹ thuật viên',
  4: 'Tiếp nhận',
};

export interface DoctorRSPModal {
  data: string;
  errorMessage: null;
  succeed: boolean;
  status: number | null;
}

export interface DoctorData extends Doctor {
  id: string;
  isDeleted: boolean;
  unit: Hospital[]
}

export interface DoctorModel {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  data: DoctorData[];
}
