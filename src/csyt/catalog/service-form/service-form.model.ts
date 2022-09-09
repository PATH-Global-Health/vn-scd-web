export interface ServiceForm {
  id: string;
  name: string;
}

export type ServiceFormCM = Omit<ServiceForm, 'id'>;
