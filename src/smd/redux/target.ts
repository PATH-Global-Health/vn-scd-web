/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CollectionResponse, ObjectResponse, Target } from '@smd/models';
import { showSuccessToast, showErrorToast } from '@smd/utils/helper';

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};
interface State {
  targetData: CollectionResponse<Target>;
  getTargetsLoading: boolean;
  createTargetLoading: boolean;
  updateTargetLoading: boolean;
}

const initialState: State = {
  targetData: defaultCollectionResponse,
  getTargetsLoading: false,
  createTargetLoading: false,
  updateTargetLoading: false,
};

export const getTargets = createAsyncThunk(
  'smd/target/getTargets',
  async (arg: { iPackageId: string; pageSize: number; pageIndex: number }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.target.get,
      params: { ...arg, ipackageId: arg.iPackageId },
    });
    return result.data as CollectionResponse<Target>;
  },
);

export const createTarget = createAsyncThunk(
  'smd/target/createTarget',
  async (data: Target, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.target.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Target>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateTarget = createAsyncThunk(
  'smd/target/updateTarget',
  async (data: Target, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.target.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Target>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const target = createSlice({
  name: 'target',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTargets.pending, (state) => {
      state.getTargetsLoading = true;
    });
    builder.addCase(getTargets.fulfilled, (state, action) => {
      state.getTargetsLoading = false;
      state.targetData = action.payload;
    });
    builder.addCase(getTargets.rejected, (state) => {
      state.getTargetsLoading = false;
    });

    builder.addCase(createTarget.pending, (state) => {
      state.createTargetLoading = true;
    });
    builder.addCase(createTarget.fulfilled, (state) => {
      state.createTargetLoading = false;
    });
    builder.addCase(createTarget.rejected, (state) => {
      state.createTargetLoading = false;
    });

    builder.addCase(updateTarget.pending, (state) => {
      state.updateTargetLoading = true;
    });
    builder.addCase(updateTarget.fulfilled, (state) => {
      state.updateTargetLoading = false;
    });
    builder.addCase(updateTarget.rejected, (state) => {
      state.updateTargetLoading = false;
    });
  },
});

export default target.reducer;
