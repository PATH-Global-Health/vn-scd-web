import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { ServiceUnit, ServiceUnitCM } from './service-unit.model';

const getServiceUnits = async (): Promise<ServiceUnit[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.serviceUnit.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as ServiceUnit[];
};

const createServiceUnit = async (data: ServiceUnitCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceUnit.create,
    data,
  });
};

const updateServiceUnit = async (data: ServiceUnit): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceUnit.update,
    data,
  });
};

const deleteServiceUnit = async (id: string): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceUnit.delete + id,
  });
};

const ServiceUnitService = {
  getServiceUnits,
  createServiceUnit,
  updateServiceUnit,
  deleteServiceUnit,
};

export default ServiceUnitService;
