/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  CollectionResponse,
  ObjectResponse,
  PatientInfo,
  PatientInfoHistory,
} from '@smd/models';
import { showErrorToast, showSuccessToast } from '@smd/utils/helper';

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};

interface State {
  patientInfoData: CollectionResponse<PatientInfo>;
  getPatientInfosLoading: boolean;
  patientInfoHistoryData: CollectionResponse<PatientInfoHistory>;
  getPatientInfoHitoriesLoading: boolean;
  createPatientInfoLoading: boolean;
  updatePatientInfoLoading: boolean;
  deletePatientInfoLoading: boolean;
}

const initialState: State = {
  patientInfoData: defaultCollectionResponse,
  getPatientInfosLoading: false,
  patientInfoHistoryData: defaultCollectionResponse,
  getPatientInfoHitoriesLoading: false,
  createPatientInfoLoading: false,
  updatePatientInfoLoading: false,
  deletePatientInfoLoading: false,
};

export const getPatientInfos = createAsyncThunk(
  'smd/patientInfo/getPatientInfos',
  async (arg: object) => {
    const result = await httpClient.put({
      url: (al) => al.smd.patientInfo.get,
      data: { ...arg },
    });
    return result.data as CollectionResponse<PatientInfo>;
  },
);

export const getPatientInfoHistories = createAsyncThunk(
  'smd/patientInfo/getPatientInfoHistories',
  async (arg: object) => {
    const result = await httpClient.get({
      url: (al) => al.smd.patientInfo.getHistory,
      params: { ...arg },
    });
    return result.data as CollectionResponse<PatientInfoHistory>;
  },
);

export const createPatientInfo = createAsyncThunk(
  'smd/patientInfo/createPatientInfo',
  async (data: PatientInfo, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.patientInfo.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<PatientInfo>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updatePatientInfo = createAsyncThunk(
  'smd/patientInfo/updatePatientInfo',
  async (data: PatientInfo, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.patientInfo.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<PatientInfo>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deletePatientInfo = createAsyncThunk(
  'smd/patientInfo/deletePatientInfo',
  async (id: PatientInfo['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.patientInfo.delete,
        params: { id },
      });
      showSuccessToast();
      return result.data as ObjectResponse<PatientInfo>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const patientInfo = createSlice({
  name: 'patientInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPatientInfos.pending, (state) => {
      state.getPatientInfosLoading = true;
    });
    builder.addCase(getPatientInfos.fulfilled, (state, action) => {
      state.getPatientInfosLoading = false;
      state.patientInfoData = action.payload;
    });
    builder.addCase(getPatientInfos.rejected, (state) => {
      state.getPatientInfosLoading = false;
    });

    builder.addCase(getPatientInfoHistories.pending, (state) => {
      state.getPatientInfoHitoriesLoading = true;
    });
    builder.addCase(getPatientInfoHistories.fulfilled, (state, action) => {
      state.getPatientInfoHitoriesLoading = false;
      state.patientInfoHistoryData = action.payload;
    });
    builder.addCase(getPatientInfoHistories.rejected, (state) => {
      state.getPatientInfoHitoriesLoading = false;
    });

    builder.addCase(createPatientInfo.pending, (state) => {
      state.createPatientInfoLoading = true;
    });
    builder.addCase(createPatientInfo.fulfilled, (state) => {
      state.createPatientInfoLoading = false;
    });
    builder.addCase(createPatientInfo.rejected, (state) => {
      state.createPatientInfoLoading = false;
    });

    builder.addCase(updatePatientInfo.pending, (state) => {
      state.updatePatientInfoLoading = true;
    });
    builder.addCase(updatePatientInfo.fulfilled, (state) => {
      state.updatePatientInfoLoading = false;
    });
    builder.addCase(updatePatientInfo.rejected, (state) => {
      state.updatePatientInfoLoading = false;
    });

    builder.addCase(deletePatientInfo.pending, (state) => {
      state.deletePatientInfoLoading = true;
    });
    builder.addCase(deletePatientInfo.fulfilled, (state) => {
      state.deletePatientInfoLoading = false;
    });
    builder.addCase(deletePatientInfo.rejected, (state) => {
      state.deletePatientInfoLoading = false;
    });
  },
});

export default patientInfo.reducer;
