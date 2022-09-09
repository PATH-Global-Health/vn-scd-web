import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { ServiceForm, ServiceFormCM } from './service-form.model';

const getServiceForms = async (): Promise<ServiceForm[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.serviceForm.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as ServiceForm[];
};

const createServiceForm = async (data: ServiceFormCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.serviceForm.create,
    data,
  });
};

const updateServiceForm = async (data: ServiceForm): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.serviceForm.update,
    data,
  });
};

const deleteServiceForm = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.serviceForm.delete + id,
    params: { id },
  });
};

const ServiceFormService = {
  getServiceForms,
  createServiceForm,
  updateServiceForm,
  deleteServiceForm,
};

export default ServiceFormService;
