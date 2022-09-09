import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import injectionObjectService from './injection-object.service';
import { InjectionObject } from './injection-object.model';

interface State {
  injectionObjectList: InjectionObject[];
  getInjectionObjectsLoading: boolean;
}

const initialState: State = {
  injectionObjectList: [],
  getInjectionObjectsLoading: false,
};

const getInjectionObjects = createAsyncThunk(
  'csyt/catalog/injectionObject/getInjectionObjects',
  async () => {
    const result = await injectionObjectService.getInjectionObjects();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/injectionObject',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInjectionObjects.pending, (state) => ({
      ...state,
      getInjectionObjectsLoading: true,
    }));
    builder.addCase(getInjectionObjects.fulfilled, (state, { payload }) => ({
      ...state,
      getInjectionObjectsLoading: false,
      injectionObjectList: payload,
    }));
    builder.addCase(getInjectionObjects.rejected, (state) => ({
      ...state,
      getInjectionObjectsLoading: false,
    }));
  },
});

export { getInjectionObjects };

export default slice.reducer;
