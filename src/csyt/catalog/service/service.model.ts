import { InjectionObject } from '../injection-object/injection-object.model';

export interface IService {
  service: Service;
}
export interface Service {
  id: string;
  code: string;
  name: string;
  serviceFormId: string;
  serviceTypeId: string;
  description: string;
  // Price: number;
  // Interval: number;
  // ServiceTypeId: string;
  injectionObject?: InjectionObject;
  injectionObjectId?: string;
}

export type ServiceCM = Omit<Service, 'id' | 'injectionObject'>;
