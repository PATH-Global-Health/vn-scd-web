import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import serviceFormService from './service-form.service';
import { ServiceForm } from './service-form.model';

interface State {
  serviceFormList: ServiceForm[];
  getServiceFormsLoading: boolean;
}

const initialState: State = {
  serviceFormList: [],
  getServiceFormsLoading: false,
};

const getServiceForms = createAsyncThunk(
  'csyt/catalog/serviceForm/getServiceForms',
  async () => {
    const result = await serviceFormService.getServiceForms();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/serviceForm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceForms.pending, (state) => ({
      ...state,
      getServiceFormsLoading: true,
    }));
    builder.addCase(getServiceForms.fulfilled, (state, { payload }) => ({
      ...state,
      getServiceFormsLoading: false,
      serviceFormList: payload,
    }));
    builder.addCase(getServiceForms.rejected, (state) => ({
      ...state,
      getServiceFormsLoading: false,
    }));
  },
});

export { getServiceForms };

export default slice.reducer;
