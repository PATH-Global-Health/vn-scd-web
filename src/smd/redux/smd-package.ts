/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { SMDPackage, CollectionResponse, ObjectResponse } from '@smd/models';
import { showSuccessToast, showErrorToast } from '@smd/utils/helper';

interface State {
  sMDPackageData: CollectionResponse<SMDPackage>;
  getPackagesLoading: boolean;
  createPackageLoading: boolean;
  updatePackageLoading: boolean;
  deletePackageLoading: boolean;
}

const initialState: State = {
  sMDPackageData: {
    pageCount: 0,
    errorMessage: '',
    data: [],
    succeed: false,
    failed: '',
  },
  getPackagesLoading: false,
  createPackageLoading: false,
  updatePackageLoading: false,
  deletePackageLoading: false,
};

export const getPackages = createAsyncThunk(
  'smd/package/getPackages',
  async (arg: { pageSize: number; pageIndex: number }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.package.get,
      params: { ...arg },
    });
    return result.data as CollectionResponse<SMDPackage>;
  },
);

export const createPackage = createAsyncThunk(
  'smd/package/createPackage',
  async (data: SMDPackage, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.package.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<SMDPackage>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updatePackage = createAsyncThunk(
  'smd/package/updatePackage',
  async (data: SMDPackage, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.package.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<SMDPackage>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deletePackage = createAsyncThunk(
  'smd/package/deletePackage',
  async (id: SMDPackage['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.package.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<SMDPackage>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const smdPackage = createSlice({
  name: 'package',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPackages.pending, (state) => {
      state.getPackagesLoading = true;
    });
    builder.addCase(getPackages.fulfilled, (state, action) => {
      state.getPackagesLoading = false;
      state.sMDPackageData = action.payload;
    });
    builder.addCase(getPackages.rejected, (state) => {
      state.getPackagesLoading = false;
    });

    builder.addCase(createPackage.pending, (state) => {
      state.createPackageLoading = true;
    });
    builder.addCase(createPackage.fulfilled, (state) => {
      state.createPackageLoading = false;
    });
    builder.addCase(createPackage.rejected, (state) => {
      state.createPackageLoading = false;
    });

    builder.addCase(updatePackage.pending, (state) => {
      state.updatePackageLoading = true;
    });
    builder.addCase(updatePackage.fulfilled, (state) => {
      state.updatePackageLoading = false;
    });
    builder.addCase(updatePackage.rejected, (state) => {
      state.updatePackageLoading = false;
    });

    builder.addCase(deletePackage.pending, (state) => {
      state.deletePackageLoading = true;
    });
    builder.addCase(deletePackage.fulfilled, (state) => {
      state.deletePackageLoading = false;
    });
    builder.addCase(deletePackage.rejected, (state) => {
      state.deletePackageLoading = false;
    });
  },
});

export default smdPackage.reducer;
