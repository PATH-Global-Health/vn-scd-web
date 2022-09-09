import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { Room } from './room.model';
import { Hospital } from '../hospital/hospital.model';

const getRooms = async (unitId: string): Promise<Room[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.room.get,
    params: { unitId },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Room[];
};

const createRoom = async (data: Room): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.room.create,
    data,
  });
};

const updateRoom = async (data: Room): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.room.update,
    data,
  });
};

const deleteRoom = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.room.delete+`?id=${id}`,
  });
};

const getHospitals = async (): Promise<Hospital[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.hospital.get,
  });
  return result.data as Hospital[];
};

const roomService = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getHospitals,
};

export default roomService;
