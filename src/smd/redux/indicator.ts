/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CollectionResponse, ObjectResponse, Indicator } from '@smd/models';
import { showErrorToast, showSuccessToast } from '@smd/utils/helper';

interface State {
  indicatorData: CollectionResponse<Indicator>;
  getIndicatorsLoading: boolean;
  createIndicatorLoading: boolean;
  updateIndicatorLoading: boolean;
  deleteIndicatorLoading: boolean;
}

const initialState: State = {
  indicatorData: {
    pageCount: 0,
    errorMessage: '',
    data: [],
    succeed: false,
    failed: '',
  },
  getIndicatorsLoading: false,
  createIndicatorLoading: false,
  updateIndicatorLoading: false,
  deleteIndicatorLoading: false,
};

export const getIndicators = createAsyncThunk(
  'smd/indicator/getIndicators',
  async (filter?: object) => {
    const result = await httpClient.get({
      url: (al) => al.smd.indicator.get,
      params: filter,
    });
    return result.data as CollectionResponse<Indicator>;
  },
);

export const createIndicator = createAsyncThunk(
  'smd/indicator/createIndicator',
  async (data: Indicator, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.indicator.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Indicator>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateIndicator = createAsyncThunk(
  'smd/indicator/updateIndicator',
  async (data: Indicator, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.indicator.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Indicator>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deleteIndicator = createAsyncThunk(
  'smd/indicator/deleteIndicator',
  async (id: Indicator['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.indicator.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Indicator>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const indicator = createSlice({
  name: 'indicator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIndicators.pending, (state) => {
      state.getIndicatorsLoading = true;
    });
    builder.addCase(getIndicators.fulfilled, (state, action) => {
      state.getIndicatorsLoading = false;
      state.indicatorData = action.payload;
    });
    builder.addCase(getIndicators.rejected, (state) => {
      state.getIndicatorsLoading = false;
    });

    builder.addCase(createIndicator.pending, (state) => {
      state.createIndicatorLoading = true;
    });
    builder.addCase(createIndicator.fulfilled, (state) => {
      state.createIndicatorLoading = false;
    });
    builder.addCase(createIndicator.rejected, (state) => {
      state.createIndicatorLoading = false;
    });

    builder.addCase(updateIndicator.pending, (state) => {
      state.updateIndicatorLoading = true;
    });
    builder.addCase(updateIndicator.fulfilled, (state) => {
      state.updateIndicatorLoading = false;
    });
    builder.addCase(updateIndicator.rejected, (state) => {
      state.updateIndicatorLoading = false;
    });

    builder.addCase(deleteIndicator.pending, (state) => {
      state.deleteIndicatorLoading = true;
    });
    builder.addCase(deleteIndicator.fulfilled, (state) => {
      state.deleteIndicatorLoading = false;
    });
    builder.addCase(deleteIndicator.rejected, (state) => {
      state.deleteIndicatorLoading = false;
    });
  },
});

export default indicator.reducer;
