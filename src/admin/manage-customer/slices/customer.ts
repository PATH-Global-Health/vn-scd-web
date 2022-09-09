import { Hospital } from '@admin/manage-account/models/hospital';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';
import { ARTHistoryModelEx, Customer, PrEPHistoryModelEx, ReferTicket, TestingHistorySlice } from '../models/customer';

import { customerService } from '../services';

interface State {
  customerList: Customer[];
  customerListByDhealth: Customer[];
  customer: Customer | null;
  formType: number;
  referFormType: number;
  selectedHospital: Hospital | null;
  testingHistory: TestingHistorySlice | null;
  prEPHistory: PrEPHistoryModelEx[];
  ARTHistory: ARTHistoryModelEx[];
  referTicket: ReferTicket[];
  updateStatus: boolean;
  getPrEPHistoryLoading: boolean;
  getARTHistoryLoading: boolean;
  getCustomersLoading: boolean;
  getTestingHistoryLoading: boolean;
}

const initialState: State = {
  customer: null,
  testingHistory: null,
  prEPHistory: [],
  ARTHistory: [],
  getPrEPHistoryLoading: false,
  getARTHistoryLoading: false,
  customerList: [],
  customerListByDhealth: [],
  formType: 0,
  referTicket: [],
  selectedHospital: null,
  referFormType: -1,
  updateStatus: false,
  getCustomersLoading: false,
  getTestingHistoryLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const getCustomers = createAsyncThunk(
  'admin/management-customer/customer/getCustomers',
  async (unitId: string) => {
    const result = await customerService.getCustomers(unitId);
    return result;
  },
);

const getCustomerById = createAsyncThunk(
  'admin/management-customer/customer/getCustomerById',
  async (userId: string) => {
    const result = await customerService.getCustomerById(userId);
    return result;
  },
);

const getCustomersByDhealth = createAsyncThunk(
  'admin/management-customer/customer/getCustomersByDhealth',
  async () => {
    const result = await customerService.getCustomersByDhealth();
    return result;
  },
);

const updateCustomers = createAsyncThunk(
  'admin/management-customer/customer/updateCustomers',
  async (data: Customer) => {
    const result = await customerService.updateCustomer(data);
    return result;
  },
);

const getReceivedCustomers = createAsyncThunk(
  'admin/management-customer/customer/getReceivedCustomers',
  async (userId: string) => {
    const result = await customerService.getReceivedCustomers(userId);
    return result;
  },
);

const getTestingHistory = createAsyncThunk(
  'admin/management-customer/customer/getTestingHistory',
  async (arg:{customerId:string, pageIndex: number, pageSize: number}) => {
    const result = await customerService.getTestingHistory(arg.customerId, arg.pageIndex, arg.pageSize);
    return result;
  },
);

const getPrEPHistory = createAsyncThunk(
  'admin/management-customer/customer/getPrEPHistory',
  async (customerId:string) => {
    const result = await customerService.getPrEPHistory(customerId);
    return result;
  },
);

const getARTHistory = createAsyncThunk(
  'admin/management-customer/customer/getARTHistory',
  async (customerId:string) => {
    const result = await customerService.getARTHistory(customerId);
    return result;
  },
);

const slice = createSlice({
  name: 'admin/management-customer/customer',
  initialState,
  reducers: {
    setFormType: (state, action) => {
      state.formType = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setReferFormType: (state, action) => {
      state.referFormType = action.payload;
    },
    setSelectHospital: (state, action) => {
      state.selectedHospital = action.payload;
    },
    setUpdateStatus: (state, action) => {
      state.updateStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomers.pending, (state) => ({
      ...state,
      getCustomersLoading: true,
    }));
    builder.addCase(getCustomers.fulfilled, (state, { payload }) => ({
      ...state,
      customerList: payload,
      getCustomersLoading: false,
    }));
    builder.addCase(getCustomers.rejected, (state) => ({
      ...state,
      getCustomersLoading: false,
    }));
    //getCustomerByDhealth
    builder.addCase(getCustomersByDhealth.pending, (state) => ({
      ...state,
      getCustomersLoading: true,
    }));
    builder.addCase(getCustomersByDhealth.fulfilled, (state, { payload }) => ({
      ...state,
      customerListByDhealth: payload,
      getCustomersLoading: false,
    }));
    builder.addCase(getCustomersByDhealth.rejected, (state) => ({
      ...state,
      getCustomersLoading: false,
    }));

    //getReceivedCustomers
    builder.addCase(getReceivedCustomers.pending, (state) => ({
      ...state,
      getCustomersLoading: true,
    }));
    builder.addCase(getReceivedCustomers.fulfilled, (state, { payload }) => ({
      ...state,
      referTicket: payload,
      getCustomersLoading: false,
    }));
    builder.addCase(getReceivedCustomers.rejected, (state) => ({
      ...state,
      getCustomersLoading: false,
    }));

    //getTestingHistory by customerId
    builder.addCase(getTestingHistory.pending, (state) => ({
      ...state,
      getTestingHistoryLoading: true,
    }));
    builder.addCase(getTestingHistory.fulfilled, (state, { payload }) => ({
      ...state,
      testingHistory: payload,
      // getTestingHistoryLoading: false,
    }));
    builder.addCase(getTestingHistory.rejected, (state) => ({
      ...state,
      getTestingHistoryLoading: false,
    }));


    //getPrEPHistory by customerId
    builder.addCase(getPrEPHistory.pending, (state) => ({
      ...state,
      getPrEPHistoryLoading: true,
    }));
    builder.addCase(getPrEPHistory.fulfilled, (state, { payload }) => ({
      ...state,
      prEPHistory: payload,
      getPrEPHistoryLoading: false,
    }));
    builder.addCase(getPrEPHistory.rejected, (state) => ({
      ...state,
      getPrEPHistoryLoading: false,
    }));

    //
    //getARTHistory by customerId
    builder.addCase(getARTHistory.pending, (state) => ({
      ...state,
      getARTHistoryLoading: true,
    }));
    builder.addCase(getARTHistory.fulfilled, (state, { payload }) => ({
      ...state,
      ARTHistory: payload,
      getARTHistoryLoading: false,
    }));
    builder.addCase(getARTHistory.rejected, (state) => ({
      ...state,
      getARTHistoryLoading: false,
    }));

    //getCustomerById
    builder.addCase(getCustomerById.pending, (state) => ({
      ...state,
      getCustomersLoading: true,
    }));
    builder.addCase(getCustomerById.fulfilled, (state, { payload }) => ({
      ...state,
      customer: payload,
      getCustomersLoading: false,
    }));
    builder.addCase(getCustomerById.rejected, (state) => ({
      ...state,
      getCustomersLoading: false,
    }));
  },
});

export { getCustomers, getTestingHistory, getPrEPHistory, getARTHistory, getReceivedCustomers, updateCustomers, getCustomersByDhealth, getCustomerById };

export const {setFormType, setCustomer, setReferFormType, setSelectHospital, setUpdateStatus} = slice.actions;

export default slice.reducer;
