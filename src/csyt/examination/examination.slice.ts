import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import moment from 'moment';

import { AppState } from '@app/store';
import { StatusMap } from '@app/components/schedule-calendar';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import { InjectionObject } from '@csyt/catalog/injection-object/injection-object.model';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import {
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';

import {
  ExaminationSchedule,
  ExaminationStatistic,
  ExaminationStatus,
} from './examination.model';
import examinationService from './examination.service';

interface State {
  selectedHospital?: CSYTHospital | AdminHospital;
  availableDateForExportList: Date[];
  getAvailableDateForExportLoading: boolean;
  statusMap: StatusMap ;
  examinationScheduleList: ExaminationSchedule[];
  getExaminationSchedulesLoading: boolean;
  from: Date;
  to: Date;
  injectionObjectList: InjectionObject[];
  getInjectionObjectsLoading: boolean;
  selectedSchedule?: ExaminationSchedule;
  availableDays: Date[];
  getAvailableDaysLoading: boolean;
  availableDoctors: Doctor[];
  getAvailableDoctorsLoading: boolean;
  availableWorkingCalendar: WorkingCalendar[];
  getAvailableWorkingCalendarLoading: boolean;
  availableReceptionDayList: WorkingCalendarDay[];
  getAvailableReceptionDayLoading: boolean;
  availableReceptionIntervalList: WorkingCalendarInterval[];
  getAvailableReceptionIntervalLoading: boolean;
  statisticData?: ExaminationStatistic;
  getStatisticLoading: boolean;
}

const {
  UNFINISHED,
  FINISHED,
  CANCELED_BY_CUSTOMER,
  NOT_DOING,
  CANCELED,
  RESULTED,
} = ExaminationStatus;

const initialState: State = {
  statusMap: {
    [UNFINISHED]: { color: 'blue', label: 'Chưa khám' },
    [FINISHED]: { color: 'teal', label: 'Đã thực hiện' },
    [RESULTED]: { color: 'green', label: 'Đã có kết quả' },
    [CANCELED_BY_CUSTOMER]: { color: 'grey', label: 'Bên hẹn huỷ' },
    [NOT_DOING]: { color: 'brown', label: 'Không thực hiện' },
    [CANCELED]: { color: 'red', label: 'Huỷ' },
  },
  examinationScheduleList: [],
  getExaminationSchedulesLoading: false,
  availableDateForExportList: [],
  getAvailableDateForExportLoading: false,
  from: moment().startOf('isoWeek').toDate(),
  to: moment().startOf('isoWeek').add(7, 'days').toDate(),
  injectionObjectList: [],
  getInjectionObjectsLoading: false,
  availableDays: [],
  getAvailableDaysLoading: false,
  availableDoctors: [],
  getAvailableDoctorsLoading: false,
  availableWorkingCalendar: [],
  getAvailableWorkingCalendarLoading: false,
  availableReceptionDayList: [],
  getAvailableReceptionDayLoading: false,
  availableReceptionIntervalList: [],
  getAvailableReceptionIntervalLoading: false,
  statisticData: undefined,
  getStatisticLoading: false,
};

const getExaminationSchedules = createAsyncThunk(
  'csyt/examination/getExaminationSchedule',
  async (arg: { from: Date; to: Date; unitId: string }) => {
    const { from, to, unitId } = arg;
    const result = await examinationService.getExaminationSchedules(
      from,
      to,
      unitId,
    );
    return result.data.map((e) => {
      if (
        e.status === UNFINISHED &&
        moment(e.interval.from).isBefore(moment().startOf('day'))
      ) {
        return { ...e, Status: NOT_DOING };
      }
      return e;
    });
  },
);

const getExaminationStatistic = createAsyncThunk(
  'csyt/examination/getExaminationStatistic',
  async (arg: { from: Date; to: Date; unitId: string }) => {
    const { from, to, unitId } = arg;
    const result = await examinationService.getExaminationStatistic(
      from,
      to,
      unitId,
    );

    return result;
  },
);

const getAvailableDays = createAsyncThunk<Date[], void, { state: AppState }>(
  'csyt/examination/getAvailableDays',
  async (arg, { getState }) => {
    const hospitalId = getState().auth.userInfo?.id ?? '';
    const result = await examinationService.getBookingAvailableDays(hospitalId);
    return result.map((d) => moment(d).toDate());
  },
);

const getAvailableDoctors = createAsyncThunk<
  Doctor[],
  Date,
  { state: AppState }
>('csyt/examination/getAvailableDoctors', async (date, { getState }) => {
  const hospitalId = getState().auth.userInfo?.id ?? '';
  const doctorIds = await examinationService.getAvailableDoctorIds(
    hospitalId,
    date,
  );

  const doctorList = getState().csyt.catalog.doctor.doctorList.filter((d) =>
    doctorIds.includes(d.id),
  );

  return doctorList;
});

const getAvailableReceptionDays = createAsyncThunk(
  'csyt/examination/getAvailableReceptionDays',
  async (arg: {unitId: string, serviceId: string}) => {
    const result = await examinationService.getAvailableReceptionDays(arg.unitId, arg.serviceId);
    return result;
  },
);

const getAvailableReceptionIntervals = createAsyncThunk(
  'csyt/examination/getAvailableReceptionIntervals',
  async (dayId: string) => {
    const result = await examinationService.getAvailableReceptionIntervals(
      dayId,
    );
    return result;
  },
);

const getAvailableDateForExport = createAsyncThunk(
  'csyt/examination/getAvailableDateForExport',
  async (unitId: string) => {
    const result = await examinationService.getAvailableDateForExport(unitId);
    return result;
  },
);

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const selectHospitalCR: CR<CSYTHospital | AdminHospital | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedHospital: action.payload,
});

const selectExaminationScheduleCR: CR<ExaminationSchedule['id'] | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedSchedule: state.examinationScheduleList.find(
    (e) => e.id === action.payload,
  ),
});

const setFromToCR: CR<{ from: Date; to: Date }> = (state, action) => ({
  ...state,
  ...action.payload,
});

const setStatusMapCR: CR<StatusMap> = (state, action) => ({
  ...state,
  statusMap: action.payload
})

const getInjectionObjects = createAsyncThunk(
  'csyt/examination/getInjectionObjects',
  async () => {
    const result = await examinationService.getInjectionObjects();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/examination',
  initialState,
  reducers: {
    selectHospital: selectHospitalCR,
    // selectHospital: (state, action) => {
    //   state.selectedHospital = action.payload;
    // },
    selectExaminationSchedule: selectExaminationScheduleCR,
    setFromTo: setFromToCR,
    setStatusMap: setStatusMapCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getExaminationSchedules.pending, (state) => ({
      ...state,
      getExaminationSchedulesLoading: true,
    }));
    builder.addCase(getExaminationSchedules.fulfilled, (state, action) => ({
      ...state,
      examinationScheduleList: action.payload,
      getExaminationSchedulesLoading: false,
      selectedSchedule: action.payload.find(
        (e) => e.id === state.selectedSchedule?.id,
      ),
    }));
    builder.addCase(getExaminationSchedules.rejected, (state) => ({
      ...state,
      getExaminationSchedulesLoading: false,
    }));
    builder.addCase(getAvailableDateForExport.pending, (state) => ({
      ...state,
      getAvailableDateForExportLoading: true,
    }));
    builder.addCase(getAvailableDateForExport.fulfilled, (state, action) => ({
      ...state,
      getAvailableDateForExportLoading: false,
      availableDateForExportList: action.payload,
    }));
    builder.addCase(getAvailableDateForExport.rejected, (state) => ({
      ...state,
      getAvailableDateForExportLoading: false,
    }));
    builder.addCase(getAvailableDays.pending, (state) => ({
      ...state,
      getAvailableDaysLoading: true,
    }));
    builder.addCase(getAvailableDays.fulfilled, (state, action) => ({
      ...state,
      availableDays: action.payload,
      getAvailableDaysLoading: false,
    }));
    builder.addCase(getAvailableDays.rejected, (state) => ({
      ...state,
      getAvailableDaysLoading: false,
    }));

    builder.addCase(getAvailableDoctors.pending, (state) => ({
      ...state,
      getAvailableDoctorsLoading: true,
    }));
    builder.addCase(getAvailableDoctors.fulfilled, (state, action) => ({
      ...state,
      availableDoctors: action.payload,
      getAvailableDoctorsLoading: false,
    }));
    builder.addCase(getAvailableDoctors.rejected, (state) => ({
      ...state,
      getAvailableDoctorsLoading: false,
    }));
    builder.addCase(getAvailableReceptionDays.pending, (state) => ({
      ...state,
      getAvailableReceptionDayLoading: true,
    }));
    builder.addCase(
      getAvailableReceptionDays.fulfilled,
      (state, { payload }) => ({
        ...state,
        getAvailableReceptionDayLoading: false,
        availableReceptionDayList: payload,
      }),
    );
    builder.addCase(getAvailableReceptionDays.rejected, (state) => ({
      ...state,
      getAvailableReceptionDayLoading: false,
    }));
    builder.addCase(getAvailableReceptionIntervals.pending, (state) => ({
      ...state,
      getAvailableReceptionIntervalLoading: true,
    }));
    builder.addCase(
      getAvailableReceptionIntervals.fulfilled,
      (state, { payload }) => ({
        ...state,
        availableReceptionIntervalList: payload,
        getAvailableReceptionIntervalLoading: false,
      }),
    );
    builder.addCase(getAvailableReceptionIntervals.rejected, (state) => ({
      ...state,
      getAvailableReceptionIntervalLoading: false,
    }));
    builder.addCase(getExaminationStatistic.pending, (state) => ({
      ...state,
      getStatisticLoading: true,
    }));
    builder.addCase(
      getExaminationStatistic.fulfilled,
      (state, { payload }) => ({
        ...state,
        statisticData: payload,
        getStatisticLoading: false,
      }),
    );
    builder.addCase(getExaminationStatistic.rejected, (state) => ({
      ...state,
      getStatisticLoading: false,
    }));

    builder.addCase(getInjectionObjects.pending, (state) => ({
      ...state,
      getInjectionObjectsLoading: true,
    }));
    builder.addCase(getInjectionObjects.fulfilled, (state, action) => ({
      ...state,
      injectionObjectList: action.payload,
      getInjectionObjectsLoading: false,
    }));
    builder.addCase(getInjectionObjects.rejected, (state) => ({
      ...state,
      getInjectionObjectsLoading: false,
    }));
  },
});



const { selectHospital, selectExaminationSchedule, setFromTo, setStatusMap } = slice.actions;

export {
  selectHospital,
  getExaminationSchedules,
  getAvailableDateForExport,
  selectExaminationSchedule,
  setFromTo,
  getAvailableDays,
  getAvailableDoctors,
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
  getExaminationStatistic,
  getInjectionObjects,
  setStatusMap
};

export default slice.reducer;
