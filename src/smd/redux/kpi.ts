/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  KPI,
  CollectionResponse,
  ObjectResponse,
  Indicator,
} from '@smd/models';
import { showErrorToast, showSuccessToast } from '@smd/utils/helper';

interface State {
  kPIData: CollectionResponse<KPI>;
  getKPIsLoading: boolean;
  createKPILoading: boolean;
  updateKPILoading: boolean;
  deleteKPILoading: boolean;
}

const initialState: State = {
  kPIData: {
    pageCount: 0,
    errorMessage: '',
    data: [],
    succeed: false,
    failed: '',
  },
  getKPIsLoading: false,
  createKPILoading: false,
  updateKPILoading: false,
  deleteKPILoading: false,
};

export const getKPIs = createAsyncThunk(
  'smd/kpi/getKPIs',
  async (arg: {
    indicatorId: Indicator['id'];
    pageSize: number;
    pageIndex: number;
  }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.kpi.get,
      params: { ...arg },
    });
    return result.data as CollectionResponse<KPI>;
  },
);

export const createKPI = createAsyncThunk(
  'smd/kpi/createKPI',
  async (data: KPI, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.kpi.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<KPI>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateKPI = createAsyncThunk(
  'smd/kpi/updateKPI',
  async (data: KPI, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.kpi.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<KPI>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deleteKPI = createAsyncThunk(
  'smd/kpi/deleteKPI',
  async (id: KPI['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.kpi.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<KPI>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const kpi = createSlice({
  name: 'kpi',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getKPIs.pending, (state) => {
      state.getKPIsLoading = true;
    });
    builder.addCase(getKPIs.fulfilled, (state, action) => {
      state.getKPIsLoading = false;
      state.kPIData = action.payload;
    });
    builder.addCase(getKPIs.rejected, (state) => {
      state.getKPIsLoading = false;
    });

    builder.addCase(createKPI.pending, (state) => {
      state.createKPILoading = true;
    });
    builder.addCase(createKPI.fulfilled, (state) => {
      state.createKPILoading = false;
    });
    builder.addCase(createKPI.rejected, (state) => {
      state.createKPILoading = false;
    });

    builder.addCase(updateKPI.pending, (state) => {
      state.updateKPILoading = true;
    });
    builder.addCase(updateKPI.fulfilled, (state) => {
      state.updateKPILoading = false;
    });
    builder.addCase(updateKPI.rejected, (state) => {
      state.updateKPILoading = false;
    });

    builder.addCase(deleteKPI.pending, (state) => {
      state.deleteKPILoading = true;
    });
    builder.addCase(deleteKPI.fulfilled, (state) => {
      state.deleteKPILoading = false;
    });
    builder.addCase(deleteKPI.rejected, (state) => {
      state.deleteKPILoading = false;
    });
  },
});

export default kpi.reducer;
