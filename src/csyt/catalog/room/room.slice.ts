import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import { Hospital as CSYTHospital } from '../hospital/hospital.model';
import roomService from './room.service';
import { Room } from './room.model';

interface State {
  selectedHospital?: AdminHospital | CSYTHospital;
  hospitalList: CSYTHospital[];
  getHospitalLoading: boolean;
  roomList: Room[];
  getRoomsLoading: boolean;
}

const initialState: State = {
  hospitalList: [],
  getHospitalLoading: false,
  roomList: [],
  getRoomsLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const selectHospitalCR: CR<AdminHospital | CSYTHospital | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedHospital: action.payload,
  roomList: [],
});

const getHospitals = createAsyncThunk('csyt/room/getHospitals', async () => {
  const result = await roomService.getHospitals();
  return result;
});

const getRooms = createAsyncThunk(
  'csyt/catalog/room/getRooms',
  async (unitId: string) => {
    const result = await roomService.getRooms(unitId);
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/room',
  initialState,
  reducers: {
    selectHospital: selectHospitalCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getRooms.pending, (state) => ({
      ...state,
      getRoomsLoading: true,
    }));
    builder.addCase(getRooms.fulfilled, (state, { payload }) => ({
      ...state,
      getRoomsLoading: false,
      roomList: payload,
    }));
    builder.addCase(getRooms.rejected, (state) => ({
      ...state,
      getRoomsLoading: false,
    }));
    builder.addCase(getHospitals.pending, (state) => ({
      ...state,
      getHospitalLoading: true,
    }));
    builder.addCase(getHospitals.fulfilled, (state, { payload }) => ({
      ...state,
      hospitalList: payload,
      getHospitalLoading: false,
    }));
    builder.addCase(getHospitals.rejected, (state) => ({
      ...state,
      getHospitalLoading: false,
    }));
  },
});

export const { selectHospital } = slice.actions;

export { getRooms, getHospitals };

export default slice.reducer;
