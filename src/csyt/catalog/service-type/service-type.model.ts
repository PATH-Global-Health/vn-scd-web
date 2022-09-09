export interface ServiceType {
  id: string;
  unitId: string;
  description: string;
  injectionObjectId: string;
  canChooseDoctor: boolean;
  canUseHealthInsurance: boolean;
  canChooseHour: boolean;
  canPostPay: boolean;
}

export type ServiceTypeCM = Omit<ServiceType, 'id'>;
