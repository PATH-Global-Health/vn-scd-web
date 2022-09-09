import { v4 as uuidv4 } from 'uuid';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import { StatusMap } from '@app/components/schedule-calendar';
// import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import {
  ScheduleGroup,
  ScheduleDay,
  ScheduleInstance,
  ScheduleGroupCM,
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
  WorkingCalendarStatus,
} from './working-schedule.model';
import workingScheduleService from './working-schedule.service';

interface MappedGroupName {
  name: string;
  uuid: string;
  original: string;
}

interface State {
  groupNameList: MappedGroupName[];
  getGroupNamesLoading: boolean;
  selectedGroupName?: MappedGroupName;
  scheduleGroupList: ScheduleGroup[];
  getScheduleGroupLoading: boolean;
  selectedScheduleGroup?: ScheduleGroup;
  scheduleDayList: ScheduleDay[];
  getScheduleDaysLoading: boolean;
  selectedScheduleDay?: ScheduleDay;
  scheduleInstanceList: ScheduleInstance[];
  getScheduleInstancesLoading: boolean;

  statusMap: StatusMap;
  selectedHospital?: CSYTHospital | AdminHospital;
  hospitalList: CSYTHospital[];
  getHospitalLoading: boolean;
  selectedWorkingCalendar?: WorkingCalendar;
  workingCalendarList: WorkingCalendar[];
  getWorkingCalendarLoading: boolean;
  selectedWorkingCalendarDay?: WorkingCalendarDay;
  workingCalendarDayList: WorkingCalendarDay[];
  getWorkingCalendarDaysLoading: boolean;
  workingCalendarIntervalList: WorkingCalendarInterval[];
  getWorkingCalendarIntervalsLoading: boolean;
  // checkScheduleResponse?: string;
  // checkScheduleLoading: boolean;

  scheduleCreatingList: MappedGroupName[];
  failedList: Array<{
    group: MappedGroupName;
    data: ScheduleGroupCM[];
  }>;
}

const { NOT_POST, POSTED, CANCEL_POST } = WorkingCalendarStatus;

const initialState: State = {
  groupNameList: [],
  getGroupNamesLoading: false,
  scheduleGroupList: [],
  getScheduleGroupLoading: false,
  scheduleDayList: [],
  getScheduleDaysLoading: false,
  scheduleInstanceList: [],
  getScheduleInstancesLoading: false,

  statusMap: {
    [NOT_POST]: { color: 'grey', label: 'Chưa đăng' },
    [POSTED]: { color: 'green', label: 'Đã đăng' },
    [CANCEL_POST]: { color: 'red', label: 'Đã hủy' },
  },
  hospitalList: [],
  getHospitalLoading: false,
  workingCalendarList: [],
  getWorkingCalendarLoading: false,
  workingCalendarDayList: [],
  getWorkingCalendarDaysLoading: false,
  workingCalendarIntervalList: [],
  getWorkingCalendarIntervalsLoading: false,
  // checkScheduleLoading: false,

  scheduleCreatingList: [],
  failedList: [],
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const convertIdToGroupName = (id: string): MappedGroupName => ({
  name: id.substring(38),
  uuid: id.substring(0, 38).replace(/\//gi, ''),
  original: id,
});

const getGroupNames = createAsyncThunk(
  'csyt/workingSchedule/getScheduleGroupNames',
  async () => {
    const result = await workingScheduleService.getScheduleGroupNames();
    return result.map((g) => {
      if (g && g.length > 38) {
        return convertIdToGroupName(g);
      }
      return {
        name: 'Không có tên',
        uuid: uuidv4(),
        original: g,
      };
    });
  },
);

const selectGroupNameCR: CR<MappedGroupName | undefined> = (state, action) => ({
  ...state,
  selectedGroupName: action.payload,
  scheduleGroupList: [],
  selectedScheduleGroup: undefined,
  scheduleDayList: [],
  selectedScheduleDay: undefined,
  scheduleInstanceList: [],
});

const getScheduleGroups = createAsyncThunk(
  'csyt/workingSchedule/getScheduleGroups',
  async (groupName: string) => {
    const result = await workingScheduleService.getScheduleGroups(groupName);
    return result;
  },
);

const selectScheduleGroupCR: CR<ScheduleGroup | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedScheduleGroup: action.payload,
  scheduleDayList: [],
  selectedScheduleDay: undefined,
  scheduleInstanceList: [],
});

const getScheduleDays = createAsyncThunk(
  'csyt/workingSchedule/getScheduleDays',
  async (groupId: string) => {
    const result = await workingScheduleService.getScheduleDays(groupId);
    return result;
  },
);

const selectScheduleDayCR: CR<ScheduleDay | undefined> = (state, action) => ({
  ...state,
  selectedScheduleDay: action.payload,
  scheduleInstanceList: [],
});

const getScheduleInstances = createAsyncThunk(
  'csyt/workingSchedule/getScheduleInstances',
  async (groupDayId: string) => {
    const result = await workingScheduleService.getScheduleInstances(
      groupDayId,
    );
    return result;
  },
);

const createScheduleGroup = createAsyncThunk(
  'csyt/workingSchedule/createScheduleGroup',
  async (data: ScheduleGroupCM[]) => {
    await Promise.all(
      data.map((d) => workingScheduleService.createScheduleGroup(d)),
    );
  },
);

const selectHospitalCR: CR<CSYTHospital | AdminHospital | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedHospital: action.payload,
  selectedWorkingCalendar: undefined,
  selectedWorkingCalendarDay: undefined,
  workingCalendarList: [],
  workingCalendarDayList: [],
  workingCalendarIntervalList: [],
});

const selectWorkingCalendarCR: CR<WorkingCalendar | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedWorkingCalendar: action.payload,
  selectedWorkingCalendarDay: undefined,
  workingCalendarDayList: [],
  workingCalendarIntervalList: [],
});

const selectWorkingCalendarDayCR: CR<WorkingCalendarDay | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedWorkingCalendarDay: action.payload,
  workingCalendarIntervalList: [],
});

const getHospitals = createAsyncThunk(
  'csyt/workingSchedule/getHospitals',
  async () => {
    const result = await workingScheduleService.getHospitals();
    return result;
  },
);

const getWorkingCalendars = createAsyncThunk(
  'csyt/workingSchedule/getWorkingCalendars',
  async (hospitalId: string) => {
    const result = await workingScheduleService.getWorkingCalendars(hospitalId);
    return result;
  },
);

const getWorkingCalendarDays = createAsyncThunk(
  'csyt/workingSchedule/getWorkingCalendarDays',
  async (workingCalendarId: string) => {
    const result = await workingScheduleService.getWorkingCalendarDays(
      workingCalendarId,
    );
    return result;
  },
);

const getWorkingCalendarIntervals = createAsyncThunk(
  'csyt/workingSchedule/getWorkingCalendarIntervals',
  async (dayId: string) => {
    const result = await workingScheduleService.getWorkingCalendarIntervals(
      dayId,
    );
    return result;
  },
);

// const checkSchedule = createAsyncThunk(
//   'csyt/workingSchedule/checkSchedule',
//   async (arg: { doctorId: Doctor['id']; fromDate: Date; toDate: Date }) => {
//     const { doctorId, fromDate, toDate } = arg;
//     const result = await workingScheduleService.checkSchedule(
//       doctorId,
//       fromDate,
//       toDate,
//     );
//     return result;
//   },
// );

const slice = createSlice({
  name: 'csyt/workingSchedule',
  initialState,
  reducers: {
    selectGroupName: selectGroupNameCR,
    selectScheduleGroup: selectScheduleGroupCR,
    selectScheduleDay: selectScheduleDayCR,
    selectHospital: selectHospitalCR,
    selectWorkingCalendar: selectWorkingCalendarCR,
    selectWorkingCalendarDay: selectWorkingCalendarDayCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getGroupNames.pending, (state) => ({
      ...state,
      getGroupNamesLoading: true,
    }));
    builder.addCase(getGroupNames.fulfilled, (state, { payload }) => ({
      ...state,
      groupNameList: payload,
      getGroupNamesLoading: false,
    }));
    builder.addCase(getGroupNames.rejected, (state) => ({
      ...state,
      getGroupNamesLoading: false,
    }));

    builder.addCase(getScheduleGroups.pending, (state) => ({
      ...state,
      getScheduleGroupLoading: true,
    }));
    builder.addCase(getScheduleGroups.fulfilled, (state, { payload }) => ({
      ...state,
      scheduleGroupList: payload,
      getScheduleGroupLoading: false,
    }));
    builder.addCase(getScheduleGroups.rejected, (state) => ({
      ...state,
      getScheduleGroupLoading: false,
    }));

    builder.addCase(getScheduleDays.pending, (state) => ({
      ...state,
      getScheduleDaysLoading: true,
    }));
    builder.addCase(getScheduleDays.fulfilled, (state, { payload }) => ({
      ...state,
      scheduleDayList: payload,
      getScheduleDaysLoading: false,
    }));
    builder.addCase(getScheduleDays.rejected, (state) => ({
      ...state,
      getScheduleDaysLoading: false,
    }));

    builder.addCase(getScheduleInstances.pending, (state) => ({
      ...state,
      getScheduleInstancesLoading: true,
    }));
    builder.addCase(getScheduleInstances.fulfilled, (state, { payload }) => ({
      ...state,
      scheduleInstanceList: payload,
      getScheduleInstancesLoading: false,
    }));
    builder.addCase(getScheduleInstances.rejected, (state) => ({
      ...state,
      getScheduleInstancesLoading: false,
    }));

    builder.addCase(createScheduleGroup.pending, (state, action) => ({
      ...state,
      scheduleCreatingList: [
        ...state.scheduleCreatingList,
        convertIdToGroupName(action.meta.arg[0].CreateGroup),
      ],
      failedList: state.failedList.filter(
        (e) => e.group.original !== action.meta.arg[0].CreateGroup,
      ),
    }));
    builder.addCase(createScheduleGroup.fulfilled, (state, action) => ({
      ...state,
      scheduleCreatingList: state.scheduleCreatingList.filter(
        (e) => e.original !== action.meta.arg[0].CreateGroup,
      ),
      failedList: state.failedList.filter(
        (e) => e.group.original !== action.meta.arg[0].CreateGroup,
      ),
    }));
    builder.addCase(createScheduleGroup.rejected, (state, action) => ({
      ...state,
      scheduleCreatingList: state.scheduleCreatingList.filter(
        (e) => e.original !== action.meta.arg[0].CreateGroup,
      ),
      failedList: [
        ...state.failedList,
        {
          group: convertIdToGroupName(action.meta.arg[0].CreateGroup),
          data: [...action.meta.arg],
        },
      ],
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
    builder.addCase(getWorkingCalendars.pending, (state) => ({
      ...state,
      getWorkingCalendarLoading: true,
    }));
    builder.addCase(getWorkingCalendars.fulfilled, (state, { payload }) => ({
      ...state,
      workingCalendarList: payload,
      getWorkingCalendarLoading: false,
    }));
    builder.addCase(getWorkingCalendars.rejected, (state) => ({
      ...state,
      getWorkingCalendarLoading: false,
    }));
    builder.addCase(getWorkingCalendarDays.pending, (state) => ({
      ...state,
      getWorkingCalendarDaysLoading: true,
    }));
    builder.addCase(getWorkingCalendarDays.fulfilled, (state, { payload }) => ({
      ...state,
      workingCalendarDayList: payload,
      getWorkingCalendarDaysLoading: false,
    }));
    builder.addCase(getWorkingCalendarDays.rejected, (state) => ({
      ...state,
      getWorkingCalendarDaysLoading: false,
    }));
    builder.addCase(getWorkingCalendarIntervals.pending, (state) => ({
      ...state,
      getWorkingCalendarIntervalsLoading: true,
    }));
    builder.addCase(
      getWorkingCalendarIntervals.fulfilled,
      (state, { payload }) => ({
        ...state,
        workingCalendarIntervalList: payload,
        getWorkingCalendarIntervalsLoading: false,
      }),
    );
    builder.addCase(getWorkingCalendarIntervals.rejected, (state) => ({
      ...state,
      getWorkingCalendarIntervalsLoading: false,
    }));
    // builder.addCase(checkSchedule.pending, (state) => ({
    //   ...state,
    //   checkScheduleLoading: true,
    // }));
    // builder.addCase(checkSchedule.fulfilled, (state, { payload }) => ({
    //   ...state,
    //   checkScheduleResponse: payload,
    //   checkScheduleLoading: false,
    // }));
    // builder.addCase(checkSchedule.rejected, (state) => ({
    //   ...state,
    //   checkScheduleLoading: false,
    // }));
  },
});

export const {
  selectGroupName,
  selectScheduleGroup,
  selectScheduleDay,
  selectHospital,
  selectWorkingCalendar,
  selectWorkingCalendarDay,
} = slice.actions;

export {
  getGroupNames,
  getScheduleGroups,
  getScheduleDays,
  getScheduleInstances,
  createScheduleGroup,
  getHospitals,
  getWorkingCalendars,
  getWorkingCalendarDays,
  getWorkingCalendarIntervals,
};

export default slice.reducer;
