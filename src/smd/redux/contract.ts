/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CollectionResponse, ObjectResponse, Contract } from '@smd/models';
import { showSuccessToast, showErrorToast } from '@smd/utils/helper';

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};
interface State {
  contractData: CollectionResponse<Contract>;
  getContractsLoading: boolean;
  createContractLoading: boolean;
  createContractError: string;
  activeContractLoading: boolean;
}

const initialState: State = {
  contractData: defaultCollectionResponse,
  getContractsLoading: false,
  createContractLoading: false,
  createContractError: '',
  activeContractLoading: false,
};

export const getContracts = createAsyncThunk(
  'smd/contract/getContracts',
  async (arg: { cboId: string; pageSize: number; pageIndex: number }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.contract.get,
      params: { ...arg },
    });
    return result.data as CollectionResponse<Contract>;
  },
);

export const createContract = createAsyncThunk(
  'smd/contract/createContract',
  async (data: Contract, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.contract.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Contract>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const activeContract = createAsyncThunk(
  'smd/contract/activeContract',
  async (contractId: Contract['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.contract.active,
        data: { contractId },
      });
      showSuccessToast();
      return result.data as ObjectResponse<Contract>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const contract = createSlice({
  name: 'contract',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContracts.pending, (state) => {
      state.getContractsLoading = true;
    });
    builder.addCase(getContracts.fulfilled, (state, action) => {
      state.getContractsLoading = false;
      state.contractData = action.payload;
    });
    builder.addCase(getContracts.rejected, (state) => {
      state.getContractsLoading = false;
    });

    builder.addCase(createContract.pending, (state) => {
      state.createContractLoading = true;
    });
    builder.addCase(createContract.fulfilled, (state) => {
      state.createContractLoading = false;
    });
    builder.addCase(createContract.rejected, (state, action) => {
      state.createContractLoading = false;
      state.createContractError = action.payload as string;
    });

    builder.addCase(activeContract.pending, (state) => {
      state.activeContractLoading = true;
    });
    builder.addCase(activeContract.fulfilled, (state) => {
      state.activeContractLoading = false;
    });
    builder.addCase(activeContract.rejected, (state) => {
      state.activeContractLoading = false;
    });
  },
});

export default contract.reducer;
