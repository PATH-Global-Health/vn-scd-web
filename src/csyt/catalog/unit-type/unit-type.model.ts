export interface UnitType {
  id: string;
  typeName: string;
}

export type UnitTypeCM = Omit<UnitType, 'id'>;
