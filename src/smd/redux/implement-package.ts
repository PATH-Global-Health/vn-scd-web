/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CollectionResponse, ImplementPackage, ObjectResponse
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
  implementPackageData: CollectionResponse<ImplementPackage>;
  getImplementPackagesLoading: boolean;
  createImplementPackageLoading: boolean;
  updateImplementPackageLoading: boolean;
}

const initialState: State = {
  implementPackageData: defaultCollectionResponse,
  getImplementPackagesLoading: false,
  createImplementPackageLoading: false,
  updateImplementPackageLoading: false,
};

export const getImplementPackages = createAsyncThunk(
  'smd/implementPackage/getImplementPackages',
  async (arg: {
    province?: string;
    packageId: string;
    pageSize: number;
    pageIndex: number;
  }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.implementPackage.get,
      params: { ...arg },
    });
    return result.data as CollectionResponse<ImplementPackage>;
  },
);

export const createImplementPackage = createAsyncThunk(
  'smd/implementPackage/createImplementPackage',
  async (data: ImplementPackage, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.implementPackage.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<ImplementPackage>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateImplementPackage = createAsyncThunk(
  'smd/implementPackage/updateImplementPackage',
  async (data: ImplementPackage, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.implementPackage.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<ImplementPackage>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const implementPackage = createSlice({
  name: 'implementPackage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getImplementPackages.pending, (state) => {
      state.getImplementPackagesLoading = true;
    });
    builder.addCase(getImplementPackages.fulfilled, (state, action) => {
      state.getImplementPackagesLoading = false;
      state.implementPackageData = action.payload;
    });
    builder.addCase(getImplementPackages.rejected, (state) => {
      state.getImplementPackagesLoading = false;
    });

    builder.addCase(createImplementPackage.pending, (state) => {
      state.createImplementPackageLoading = true;
    });
    builder.addCase(createImplementPackage.fulfilled, (state) => {
      state.createImplementPackageLoading = false;
    });
    builder.addCase(createImplementPackage.rejected, (state) => {
      state.createImplementPackageLoading = false;
    });

    builder.addCase(updateImplementPackage.pending, (state) => {
      state.updateImplementPackageLoading = true;
    });
    builder.addCase(updateImplementPackage.fulfilled, (state) => {
      state.updateImplementPackageLoading = false;
    });
    builder.addCase(updateImplementPackage.rejected, (state) => {
      state.updateImplementPackageLoading = false;
    });
  },
});

export default implementPackage.reducer;
