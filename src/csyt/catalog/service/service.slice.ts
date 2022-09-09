import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import serviceService from './service.service';
import { Service } from './service.model';

interface State {
  serviceList: Service[];
  getServicesLoading: boolean;
  immunizationServiceList: Service[];
  getImmunizationServiceLoading: boolean;
  examinationServiceList: Service[];
  getExaminationServiceLoading: boolean;
}

const initialState: State = {
  serviceList: [],
  getServicesLoading: false,
  immunizationServiceList: [],
  getImmunizationServiceLoading: false,
  examinationServiceList: [],
  getExaminationServiceLoading: false,
};

const getServices = createAsyncThunk(
  'csyt/catalog/service/getServices',
  async () => {
    const result = await serviceService.getServices();
    return result;
  },
);

const getImmunizationServices = createAsyncThunk(
  'csyt/catalog/service/getImmunizationServices',
  async ({
    serviceTypeId,
    injectionObjectId,
  }: {
    serviceTypeId: string;
    injectionObjectId: string;
  }) => {
    const result = await serviceService.getImmunizationServices(
      serviceTypeId,
      injectionObjectId,
    );
    return result;
  },
);

const getExaminationServices = createAsyncThunk(
  'csyt/catalog/service/getExaminationServices',
  async ({
    serviceTypeId,
    injectionObjectId,
  }: {
    serviceTypeId: string;
    injectionObjectId: string;
  }) => {
    const result = await serviceService.getExaminationServices(
      serviceTypeId,
      injectionObjectId,
    );
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => ({
      ...state,
      getServicesLoading: true,
    }));
    builder.addCase(getServices.fulfilled, (state, { payload }) => ({
      ...state,
      getServicesLoading: false,
      serviceList: payload,
    }));
    builder.addCase(getServices.rejected, (state) => ({
      ...state,
      getServicesLoading: false,
    }));
    builder.addCase(getImmunizationServices.pending, (state) => ({
      ...state,
      getImmunizationServiceLoading: true,
    }));
    builder.addCase(
      getImmunizationServices.fulfilled,
      (state, { payload }) => ({
        ...state,
        getImmunizationServiceLoading: false,
        immunizationServiceList: payload,
      }),
    );
    builder.addCase(getImmunizationServices.rejected, (state) => ({
      ...state,
      getImmunizationServiceLoading: false,
    }));
    builder.addCase(getExaminationServices.pending, (state) => ({
      ...state,
      getExaminationServiceLoading: true,
    }));
    builder.addCase(getExaminationServices.fulfilled, (state, { payload }) => ({
      ...state,
      getExaminationServiceLoading: false,
      examinationServiceList: payload,
    }));
    builder.addCase(getExaminationServices.rejected, (state) => ({
      ...state,
      getExaminationServiceLoading: false,
    }));
  },
});

export { getServices, getImmunizationServices, getExaminationServices };

export default slice.reducer;
