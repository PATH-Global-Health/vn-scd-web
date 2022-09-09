import { httpClient, apiLinks } from '@app/utils';
import {
  ARTHistoryModel,
  ARTHistoryModelEx,
  Customer,
  LayTestUpdate,
  PrEPHistoryModel,
  PrEPHistoryModelEx,
  PrEPUpdateHistory,
  ReceivedCustomer,
  ReferModel,
  ReferTicket,
  TestingHistoryModel,
  TestingHistorySlice,
} from '../models/customer';

const getCustomers = async (unitId: string): Promise<Customer[]> => {
  try {
    const result = await httpClient.get({
      // url: apiLinks.csyt.userProfile.getAll,
      // url: apiLinks.csyt.userProfile.getByStatus,
      url: apiLinks.csyt.userProfile.getByUnitId + `/${unitId}`,
    });
    return result.data as Customer[];
  } catch (error) {
    return [];
  }
};

const getCustomerById = async (userId: string): Promise<Customer> => {
  const result = await httpClient.get({
    // url: apiLinks.csyt.userProfile.getAll,
    // url: apiLinks.csyt.userProfile.getByStatus,
    url: apiLinks.csyt.userProfile.getById,
    params: { userId },
  });
  return result.data as Customer;
};

const getCustomersByDhealth = async (): Promise<Customer[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.csyt.userProfile.getAll,
      // url: apiLinks.csyt.userProfile.getByStatus,
      // url: apiLinks.csyt.userProfile.getByUnitId + `/${unitId}`,
    });
    return result.data as Customer[];
  } catch (error) {
    return [];
  }
};

const getReceivedCustomers = async (unitId: string): Promise<ReferTicket[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.referTicket.get,
    params: {
      unitId: unitId,
    },
  });
  return result.data as ReferTicket[];
};

const updateReceiveCustomers = async (
  data: ReceivedCustomer,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.referTicket.update + `/${data.idReferTicket}`,
    data: data,
  });
  // return result.data as ReferTicket[];
};

type CreateError<T> = {
  [P in keyof T]?: string[];
};

const createCustomer = async (
  data: Customer,
  unitId: string,
): Promise<void> => {
  // try {
  await httpClient.post({
    url: apiLinks.csyt.userProfile.createByFacility + `/${unitId}`,
    data,
  });
  // return {};
  // } catch (error) {
  //   return error.response.data.errors as CreateError<Customer>;
  // }
};

const updateCustomer = async (data: Customer): Promise<Customer> => {
  // try {
  const result = await httpClient.put({
    url: apiLinks.csyt.userProfile.update,
    data,
  });
  return result.data as Customer;
  // } catch (error) {
  //    (error);
  // }
};

const updateLayTest = async (data: LayTestUpdate): Promise<void> => {
  // try {
  await httpClient.put({
    url: apiLinks.csyt.examination.updateLayTest,
    data,
  });
};

const updatePrEPHistory = async (data: PrEPUpdateHistory): Promise<void> => {
  // try {
  await httpClient.put({
    params: { id: data.id },
    url: apiLinks.csyt.examination.updatePrEPHistory,
    data,
  });
};

const updateARTHistory = async (data: PrEPUpdateHistory): Promise<void> => {
  // try {
  await httpClient.put({
    url: apiLinks.csyt.examination.updateARTHistory + `/${data.id}`,
    data,
  });
};

const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.csyt.userProfile.delete,
      params: { id },
    });
  } catch (error) {}
};

const createTestingHistory = async (
  data: TestingHistoryModel,
): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.examination.createTestingHistory,
    data: data,
  });
};

const createPrEPHistory = async (data: PrEPHistoryModel): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.examination.createPrEPHistory,
    data: data,
  });
};

const createARTHistory = async (data: ARTHistoryModel): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.examination.createARTHistory,
    data: data,
  });
};

const createReferTicket = async (data: ReferModel): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.referTicket.create,
    data: data,
  });
};

const getTestingHistory = async (
  customerId: string,
  pageIndex: number,
  pageSize: number,
): Promise<TestingHistorySlice> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getTestingHistory,
    params: {
      customerId: customerId,
      pageIndex: pageIndex,
      pageSize: pageSize,
    },
  });
  return result.data as TestingHistorySlice;
};

const getPrEPHistory = async (
  customerId: string,
): Promise<PrEPHistoryModelEx[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getPrEPHistory + `/${customerId}`,
    // params: { customerId: customerId }
  });
  return result.data as PrEPHistoryModelEx[];
};

const getARTHistory = async (
  customerId: string,
): Promise<ARTHistoryModelEx[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getARTHistory + `/${customerId}`,
    // params: { customerId: customerId }
  });
  return result.data as ARTHistoryModelEx[];
};

const customerService = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createTestingHistory,
  getTestingHistory,
  createPrEPHistory,
  createARTHistory,
  getPrEPHistory,
  getARTHistory,
  createReferTicket,
  getReceivedCustomers,
  updateReceiveCustomers,
  getCustomersByDhealth,
  getCustomerById,
  updateLayTest,
  updatePrEPHistory,
  updateARTHistory,
};

export default customerService;
