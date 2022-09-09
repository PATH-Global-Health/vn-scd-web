import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { UnitType, UnitTypeCM } from './unit-type.model';

const getUnitTypes = async (): Promise<UnitType[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.unitType.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as UnitType[];
};

const createUnitType = async (data: UnitTypeCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.unitType.create,
    data,
  });
};

const updateUnitType = async (data: UnitType): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.unitType.update,
    data,
  });
};

const deleteUnitType = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.unitType.delete + id,
  });
};

const UnitTypeService = {
  getUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType,
};

export default UnitTypeService;
