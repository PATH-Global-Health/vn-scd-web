import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import unitDoctorService from './unit-doctor.service';
import { UnitDoctor } from './unit-doctor.model';

interface State {
  unitDoctorList: UnitDoctor[];
  getUnitDoctorsLoading: boolean;
}

const initialState: State = {
  unitDoctorList: [],
  getUnitDoctorsLoading: false,
};

const getUnitDoctors = createAsyncThunk(
  'csyt/catalog/unitDoctor/getUnitDoctors',
  async () => {
    const result = await unitDoctorService.getUnitDoctors();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/unitDoctor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnitDoctors.pending, (state) => ({
      ...state,
      getUnitDoctorsLoading: true,
    }));
    builder.addCase(getUnitDoctors.fulfilled, (state, { payload }) => ({
      ...state,
      getUnitDoctorsLoading: false,
      unitDoctorList: payload,
    }));
    builder.addCase(getUnitDoctors.rejected, (state) => ({
      ...state,
      getUnitDoctorsLoading: false,
    }));
  },
});

export { getUnitDoctors };

export default slice.reducer;
