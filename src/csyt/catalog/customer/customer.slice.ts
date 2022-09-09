import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import customerService from './customer.service';
import { Customer } from './customer.model';

interface State {
  customerList: Customer[];
  getCustomersLoading: boolean;
}

const initialState: State = {
  customerList: [],
  getCustomersLoading: false,
};

const getCustomers = createAsyncThunk(
  'csyt/catalog/customer/getCustomers',
  async () => {
    const result = await customerService.getCustomers();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomers.pending, (state) => ({
      ...state,
      getCustomersLoading: true,
    }));
    builder.addCase(getCustomers.fulfilled, (state, action) => ({
      ...state,
      customerList: action.payload,
      getCustomersLoading: false,
    }));
    builder.addCase(getCustomers.rejected, (state) => ({
      ...state,
      getCustomersLoading: false,
    }));
  },
});

export { getCustomers };

export default slice.reducer;
