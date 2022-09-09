import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import serviceUnitService from './service-unit.service';
import { ServiceUnit } from './service-unit.model';

interface State {
  serviceUnitList: ServiceUnit[];
  getServiceUnitsLoading: boolean;
}

const initialState: State = {
  serviceUnitList: [],
  getServiceUnitsLoading: false,
};

const getServiceUnits = createAsyncThunk(
  'csyt/catalog/serviceUnit/getServiceUnits',
  async () => {
    const result = await serviceUnitService.getServiceUnits();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/serviceUnit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceUnits.pending, (state) => ({
      ...state,
      getServiceUnitsLoading: true,
    }));
    builder.addCase(getServiceUnits.fulfilled, (state, { payload }) => ({
      ...state,
      getServiceUnitsLoading: false,
      serviceUnitList: payload,
    }));
    builder.addCase(getServiceUnits.rejected, (state) => ({
      ...state,
      getServiceUnitsLoading: false,
    }));
  },
});

export { getServiceUnits };

export default slice.reducer;
