import { Hospital } from '@admin/manage-account/models/hospital';

export interface Room {
  isDeleted: boolean;
  id: string;
  name: string;
  code: string;
  unit: Hospital;
  unitId?: string;
  description?: string;
}

export interface RoomCM extends Omit<Room, 'id' | 'unit'> {
  unitId: string;
}
