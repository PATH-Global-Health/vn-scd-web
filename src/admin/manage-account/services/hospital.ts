import { httpClient, apiLinks } from '@app/utils';

import { Hospital, HospitalCM, ReferHospital } from '../models/hospital';

const getHospitals = async (): Promise<Hospital[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.manageAccount.hospitals,
    });
    return result.data as Hospital[];
  } catch (error) {
    return [];
  }
};

const getHospitalById = async (id: string): Promise<Hospital> => {
  const result = await httpClient.get({
    url: apiLinks.manageAccount.hospitals,
    params: { id: id },
  });
  return result.data as Hospital;
};

const geRefertHospitals = async (
  isTestingFacility: boolean,
  isPrEPFacility: boolean,
  isARTFacility: boolean,
  pageIndex: number,
  pageSize: number,
): Promise<ReferHospital> => {
  const result = await httpClient.get({
    url: apiLinks.manageAccount.referHospitals,
    params: {
      isTestingFacility: isTestingFacility ? isTestingFacility : null,
      isPrEPFacility: isPrEPFacility ? isPrEPFacility : null,
      isARTFacility: isARTFacility ? isARTFacility : null,
      pageIndex: pageIndex,
      pageSize: pageSize,
    },
  });
  return result.data as ReferHospital;
};

type CreateError<T> = {
  [P in keyof T]?: string[];
};

const createHospital = async (
  data: Hospital,
): Promise<CreateError<HospitalCM>> => {
  await httpClient.post({
    url: apiLinks.manageAccount.hospitals,
    data,
  });
  return {};
};

const updateHospital = async (data: Hospital): Promise<void> => {
  await httpClient.put({
    url: apiLinks.manageAccount.hospitals,
    data,
  });
};

//----------
const setTestingFacility = async (
  id: string,
  isTestingFacility: boolean,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.hospital.setTesting + `/${id}`,
    data: { isTestingFacility: isTestingFacility },
    // params: {id: id}
  });
};

const setPrEPFacility = async (
  id: string,
  isPrEPFacility: boolean,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.hospital.setPrEP + `/${id}`,
    data: { isPrEPFacility: isPrEPFacility },
    // params: {id: id}
  });
};

const setARVFacility = async (
  id: string,
  isARTFacility: boolean,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.hospital.setARV + `/${id}`,
    data: { isARTFacility: isARTFacility },
  });
};
//----------

const deleteHospital = async (id: string): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.manageAccount.hospitals,
      params: { id },
    });
  } catch (error) {}
};

const updateLogo = async (data: FormData): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.auth.updateLogo,
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  } catch (error) {}
};

const getHospitalLogo = async (unitId: string): Promise<void> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.csyt.hospital.getLogo + `/${unitId}`,
    });
    // return result.data as Hospital[];
  } catch (error) {
    // return [];
  }
};

const hospitalService = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  updateLogo,
  getHospitalLogo,
  setTestingFacility,
  setARVFacility,
  setPrEPFacility,
  geRefertHospitals,
  getHospitalById,
};

export default hospitalService;
