/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CBO, CollectionResponse, ObjectResponse } from '@smd/models';
import { showErrorToast, showSuccessToast } from '@smd/utils/helper';

interface State {
  cboByToken: CollectionResponse<CBO>;
  getCBOByTokenLoading: boolean;
  cboData: CollectionResponse<CBO>;
  getCBOsLoading: boolean;
  cboInfo: CBO | null;
  getInfoLoading: boolean;
  createCBOLoading: boolean;
  updateCBOLoading: boolean;
  deleteCBOLoading: boolean;
}

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};

const initialState: State = {
  cboByToken: defaultCollectionResponse,
  getCBOByTokenLoading: false,
  cboData: defaultCollectionResponse,
  getCBOsLoading: false,
  cboInfo: null,
  getInfoLoading: false,
  createCBOLoading: false,
  updateCBOLoading: false,
  deleteCBOLoading: false,
};

export const getCBOs = createAsyncThunk(
  'smd/cbo/getCBOs',
  async (arg: {
    isGetAll: boolean;
    projectId?: string;
    pageSize: number;
    pageIndex: number;
    searchValue?: string;
  }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.cbo[arg.isGetAll ? 'getAll' : 'get'],
      params: { ...arg },
    });
    return result.data as CollectionResponse<CBO>;
  },
);

export const getListCBOsWithData = createAsyncThunk(
  'smd/report/getListCBOsWithData',
  async () => {
    const result = await httpClient.get({
      url: (al) => al.smd.report.getListCBOsWithData,
    });
    return result.data.data;
  },
);

export const getListProvincesWithData = createAsyncThunk(
  'smd/report/getListProvincesWithData',
  async () => {
    const result = await httpClient.get({
      url: (al) => al.smd.report.getListProvincesWithData,
    });
    return result.data.data;
  },
);

export const getLastUpdated = createAsyncThunk(
  'smd/report/getLastUpdated',
  async () => {
    const result = await httpClient.get({
      url: (al) => al.smd.report.getLastUpdated,
    });
    return result.data.data;
  },
);

export const getCBOsByToken = createAsyncThunk(
  'smd/cbo/getCBOsByToken',
  async (arg: {
    pageSize: number;
    pageIndex: number;
    searchValue?: string;
  }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.cbo.getByToken,
      params: { ...arg },
    });
    return result.data as CollectionResponse<CBO>;
  },
);

export const getInfo = createAsyncThunk('smd/cbo/getInfo', async () => {
  const result = await httpClient.get({
    url: (al) => al.smd.cbo.getInfo,
  });
  return result.data.data as CBO;
});

export const createCBO = createAsyncThunk(
  'smd/cbo/createCBO',
  async (data: CBO, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.cbo.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<CBO>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateCBO = createAsyncThunk(
  'smd/cbo/updateCBO',
  async (data: CBO, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.cbo.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<CBO>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deleteCBO = createAsyncThunk(
  'smd/cbo/deleteCBO',
  async (id: CBO['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.cbo.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<CBO>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const cbo = createSlice({
  name: 'cbo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCBOs.pending, (state) => {
      state.getCBOsLoading = true;
      state.cboData = defaultCollectionResponse;
    });
    builder.addCase(getCBOs.fulfilled, (state, action) => {
      state.getCBOsLoading = false;
      state.cboData = action.payload;
    });
    builder.addCase(getCBOs.rejected, (state) => {
      state.getCBOsLoading = false;
    });

    builder.addCase(getCBOsByToken.pending, (state) => {
      state.getCBOByTokenLoading = true;
    });
    builder.addCase(getCBOsByToken.fulfilled, (state, action) => {
      state.getCBOByTokenLoading = false;
      state.cboByToken = action.payload;
    });
    builder.addCase(getCBOsByToken.rejected, (state) => {
      state.getCBOByTokenLoading = false;
    });

    builder.addCase(getInfo.pending, (state) => {
      state.getInfoLoading = true;
    });
    builder.addCase(getInfo.fulfilled, (state, action) => {
      state.getInfoLoading = false;
      state.cboInfo = action.payload;
    });
    builder.addCase(getInfo.rejected, (state) => {
      state.getInfoLoading = false;
    });

    builder.addCase(createCBO.pending, (state) => {
      state.createCBOLoading = true;
    });
    builder.addCase(createCBO.fulfilled, (state) => {
      state.createCBOLoading = false;
    });
    builder.addCase(createCBO.rejected, (state) => {
      state.createCBOLoading = false;
    });

    builder.addCase(updateCBO.pending, (state) => {
      state.updateCBOLoading = true;
    });
    builder.addCase(updateCBO.fulfilled, (state) => {
      state.updateCBOLoading = false;
    });
    builder.addCase(updateCBO.rejected, (state) => {
      state.updateCBOLoading = false;
    });

    builder.addCase(deleteCBO.pending, (state) => {
      state.deleteCBOLoading = true;
    });
    builder.addCase(deleteCBO.fulfilled, (state) => {
      state.deleteCBOLoading = false;
    });
    builder.addCase(deleteCBO.rejected, (state) => {
      state.deleteCBOLoading = false;
    });
  },
});

export default cbo.reducer;
