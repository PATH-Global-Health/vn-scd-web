import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import unitTypeService from './unit-type.service';
import { UnitType } from './unit-type.model';

interface State {
  unitTypeList: UnitType[];
  getUnitTypesLoading: boolean;
}

const initialState: State = {
  unitTypeList: [],
  getUnitTypesLoading: false,
};

const getUnitTypes = createAsyncThunk(
  'csyt/catalog/unitType/getUnitTypes',
  async () => {
    const result = await unitTypeService.getUnitTypes();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/unitType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnitTypes.pending, (state) => ({
      ...state,
      getUnitTypesLoading: true,
    }));
    builder.addCase(getUnitTypes.fulfilled, (state, { payload }) => ({
      ...state,
      getUnitTypesLoading: false,
      unitTypeList: payload,
    }));
    builder.addCase(getUnitTypes.rejected, (state) => ({
      ...state,
      getUnitTypesLoading: false,
    }));
  },
});

export { getUnitTypes };

export default slice.reducer;
