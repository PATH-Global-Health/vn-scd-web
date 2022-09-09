export interface ServiceUnit {
  id: string;
  name: string;
}

export type ServiceUnitCM = Omit<ServiceUnit, 'id'>;
