import { httpClient, apiLinks } from '@app/utils';
import { Customer, CustomerCM } from './customer.model';

const getCustomers = async (): Promise<Customer[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.catalog.profile.get,
  });

  return result.data as Customer[];
};

const getCustomerDetails = async (userId: string): Promise<Customer> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.catalog.profile.getDetails,
    params: { userId },
  });

  return result.data as Customer;
};

const createCustomer = async (data: CustomerCM): Promise<string> => {
  const result = await httpClient.post({
    url: apiLinks.csyt.catalog.profile.create,
    data,
  });

  return result.data as string;
};

const customerService = {
  getCustomers,
  getCustomerDetails,
  createCustomer,
};

export default customerService;
