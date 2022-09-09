import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import doctorService from './doctor.service';
import { Doctor, DoctorModel } from './doctor.model';

interface State {
  doctorList: Doctor[];
  doctorPagination: DoctorModel | null;
  getDoctorsLoading: boolean;
  // defaultPassword: DoctorRSPModal | null;
  statusResetPassword: number | null;
  getdefaultPasswordLoading: boolean;
}

const initialState: State = {
  doctorList: [],
  doctorPagination: null,
  getDoctorsLoading: false,
  statusResetPassword: null,
  getdefaultPasswordLoading: false,
};

const getDoctors = createAsyncThunk(
  'csyt/catalog/doctor/getDoctors',
  async () => {
    const result = await doctorService.getDoctors();
    return result;
  },
);

const getAllDoctor = createAsyncThunk(
  'csyt/catalog/doctor/getAllDoctor',
  async (arg:{pageIndex: number, pageSize: number, textSearch: string}) => {
    const result = await doctorService.getAllDoctor(arg.pageIndex, arg.pageSize, arg.textSearch);
    return result;
  },
);

const resetDefaultPassword = createAsyncThunk(
  'csyt/catalog/doctor/resetDefaultPassword',
  async (data: string) => {
    const result = await doctorService.resetDefaultPassword(data);
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/doctor',
  initialState,
  reducers: {
    setResetDefaultPassword: (state, action) => {
      state.statusResetPassword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDoctors.pending, (state) => ({
      ...state,
      getDoctorsLoading: true,
    }));
    builder.addCase(getDoctors.fulfilled, (state, { payload }) => ({
      ...state,
      getDoctorsLoading: false,
      doctorList: payload,
    }));
    builder.addCase(getDoctors.rejected, (state) => ({
      ...state,
      getDoctorsLoading: false,
    }));

    //getDoctorPagination
    builder.addCase(getAllDoctor.pending, (state) => ({
      ...state,
      getDoctorsLoading: true,
    }));
    builder.addCase(getAllDoctor.fulfilled, (state, { payload }) => ({
      ...state,
      getDoctorsLoading: false,
      doctorPagination: payload,
    }));
    builder.addCase(getAllDoctor.rejected, (state) => ({
      ...state,
      getDoctorsLoading: false,
    }));

    //resetDefaultPassword
    builder.addCase(resetDefaultPassword.pending, (state) => ({
      ...state,
      getdefaultPasswordLoading: true,
    }));
    builder.addCase(resetDefaultPassword.fulfilled, (state, { payload }) => ({
      ...state,
      getdefaultPasswordLoading: false,
      statusResetPassword: payload,
    }));
    builder.addCase(resetDefaultPassword.rejected, (state) => ({
      ...state,
      getdefaultPasswordLoading: false,
    }));
  },
});

export { getDoctors, resetDefaultPassword, getAllDoctor };
export const { setResetDefaultPassword } = slice.actions

export default slice.reducer;
