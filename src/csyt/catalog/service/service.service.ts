import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { Service, ServiceCM } from './service.model';

const getServices = async (): Promise<Service[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.service.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Service[];
};

const createService = async (data: ServiceCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.service.create,
    data: {
      ...data,
      LimitedOlds: [],
      InjectionObject: null,
    },
  });
};

const updateService = async (data: Service): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.service.update,
    data: {
      ...data,
      LimitedOlds: [],
      InjectionObject: null,
    },
  });
};

const deleteService = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.service.delete,
    params: { id },
  });
};

const getImmunizationServices = async (
  serviceTypeId: string,
  injectionObjectId: string,
): Promise<Service[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.service.get,
    params: {
      serviceFormId: 'd2e89a14-b17c-4d86-d598-08d889ed7ae2', // dơ vl hic
      serviceTypeId,
      injectionObjectId,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Service[];
};

const getExaminationServices = async (
  serviceTypeId: string,
  injectionObjectId: string,
): Promise<Service[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.service.get,
    params: {
      serviceFormId: 'a0731d3e-e5f0-4de4-d599-08d889ed7ae2', // dơ vl hic
      serviceTypeId,
      injectionObjectId,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Service[];
};

const serviceService = {
  getServices,
  createService,
  updateService,
  deleteService,
  getImmunizationServices,
  getExaminationServices,
};

export default serviceService;
