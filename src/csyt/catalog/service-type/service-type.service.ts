import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { ServiceType, ServiceTypeCM } from './service-type.model';

const getServiceTypes = async (): Promise<ServiceType[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.serviceType.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as ServiceType[];
};

const createServiceType = async (data: ServiceTypeCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceType.create,
    data,
  });
};

const updateServiceType = async (data: ServiceType): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceType.update,
    data,
  });
};

const deleteServiceType = async (id: string): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceType.delete + id,
  });
};

const serviceTypeService = {
  getServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType,
};

export default serviceTypeService;
