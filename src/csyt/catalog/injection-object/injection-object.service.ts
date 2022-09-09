import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { InjectionObject, InjectionObjectCM } from './injection-object.model';

const getInjectionObjects = async (): Promise<InjectionObject[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.injectionObject.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as InjectionObject[];
};

const createInjectionObject = async (
  data: InjectionObjectCM,
): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.injectionObject.create,
    data,
  });
};

const updateInjectionObject = async (data: InjectionObject): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.injectionObject.update,
    data,
  });
};

const deleteInjectionObject = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.injectionObject.delete + id,
  });
};

const InjectionObjectService = {
  getInjectionObjects,
  createInjectionObject,
  updateInjectionObject,
  deleteInjectionObject,
};

export default InjectionObjectService;
