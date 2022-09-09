import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import serviceTypeService from './service-type.service';
import { ServiceType } from './service-type.model';

interface State {
  serviceTypeList: ServiceType[];
  getServiceTypesLoading: boolean;
}

const initialState: State = {
  serviceTypeList: [],
  getServiceTypesLoading: false,
};

const getServiceTypes = createAsyncThunk(
  'csyt/catalog/serviceType/getServiceTypes',
  async () => {
    const result = await serviceTypeService.getServiceTypes();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/serviceType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceTypes.pending, (state) => ({
      ...state,
      getServiceTypesLoading: true,
    }));
    builder.addCase(getServiceTypes.fulfilled, (state, { payload }) => ({
      ...state,
      getServiceTypesLoading: false,
      serviceTypeList: payload,
    }));
    builder.addCase(getServiceTypes.rejected, (state) => ({
      ...state,
      getServiceTypesLoading: false,
    }));
  },
});

export { getServiceTypes };

export default slice.reducer;
