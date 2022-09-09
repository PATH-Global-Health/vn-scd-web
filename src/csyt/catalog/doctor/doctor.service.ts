import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { Doctor, DoctorModel } from './doctor.model';

const getDoctors = async (): Promise<Doctor[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.doctor.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Doctor[];
};

const getAllDoctor = async (
  pageIndex: number,
  pageSize: number,
  textSearch: string,
): Promise<DoctorModel> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.doctor.getAll,
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize,
      textSearch: textSearch,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as DoctorModel;
};

const createDoctor = async (data: Doctor): Promise<void> => {
  await httpClient.post({
    url:
      apiLinks.csyt.doctor.registerDoctor +
      `?userName=${data.userName}&password=${data.password}`,
    data,
  });
};

const updateDoctor = async (data: Doctor): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.doctor.update,
    data,
  });
};

const resetDefaultPassword = async (data: string): Promise<number> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.doctor.resetDefaultPassword + `?username=${data}`,
  });
  return result.status as number;
};

const deleteDoctor = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.doctor.delete + id,
  });
};

const doctorService = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  resetDefaultPassword,
  getAllDoctor,
};

export default doctorService;
