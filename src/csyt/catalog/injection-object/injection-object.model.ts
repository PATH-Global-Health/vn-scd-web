export interface InjectionObject {
  id: string;
  name: string;
  fromDaysOld: number | null;
  toDaysOld: number | null;
}

export type InjectionObjectCM = Omit<InjectionObject, 'id'>;
