export interface UnitDoctor {
  id: string;
  name: string;
}

export type UnitDoctorCM = Omit<UnitDoctor, 'id'>;
