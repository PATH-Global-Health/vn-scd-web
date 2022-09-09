import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { UnitDoctor, UnitDoctorCM } from './unit-doctor.model';

const getUnitDoctors = async (): Promise<UnitDoctor[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.unitDoctor.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as UnitDoctor[];
};

const createUnitDoctor = async (data: UnitDoctorCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.unitDoctor.create,
    data,
  });
};

const updateUnitDoctor = async (data: UnitDoctor): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.unitDoctor.update,
    data,
  });
};

const deleteUnitDoctor = async (id: string): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.unitDoctor.delete + id,
  });
};

const UnitDoctorService = {
  getUnitDoctors,
  createUnitDoctor,
  updateUnitDoctor,
  deleteUnitDoctor,
};

export default UnitDoctorService;
