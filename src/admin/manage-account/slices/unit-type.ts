import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import { UnitType } from '../models/unit-type';

import unitTypeService from '../services/unit-type';

interface State {
  unitTypeList: UnitType[];
  getUnitTypesLoading: boolean;
}

const initialState: State = {
  unitTypeList: [],
  getUnitTypesLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const getUnitTypes = createAsyncThunk(
  'admin/account/unitType/getUnitTypes',
  async () => {
    const result = await unitTypeService.getUnitTypes();
    return result;
  },
);

const slice = createSlice({
  name: 'admin/account/unitType',
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
