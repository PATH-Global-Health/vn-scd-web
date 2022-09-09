/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';
import { Hospital } from '@csyt/catalog/hospital/hospital.model';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import {
  ScheduleGroup,
  ScheduleDay,
  ScheduleInstance,
  ScheduleGroupCM,
  WorkingCalendarCM,
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
  DoctorStatusMap,
} from './working-schedule.model';

const getScheduleGroupNames = async (): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.workingSchedule.getGroupNameList,
  });

  return result.data as string[];
};

const getScheduleGroups = async (group: string): Promise<ScheduleGroup[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.workingSchedule.getScheduleGroupList,
    params: {
      pageIndex: 1,
      pageSize: 1000,
      search: '',
      orderBy: '',
      group,
    },
  });

  return result.data.data as ScheduleGroup[];
};

const getScheduleDays = async (groupId: string): Promise<ScheduleDay[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.workingSchedule.getScheduleDayList,
    params: {
      Id: groupId,
      pageIndex: 1,
      pageSize: 1000,
      search: '',
      orderBy: '',
    },
  });

  return result.data.data as ScheduleDay[];
};

const getScheduleInstances = async (
  scheduleDayId: string,
): Promise<ScheduleInstance[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.workingSchedule.getScheduleInstanceList,
    params: {
      Id: scheduleDayId,
      pageIndex: 1,
      pageSize: 1000,
      search: '',
      orderBy: '',
    },
  });

  return result.data.data as ScheduleInstance[];
};

const createScheduleGroup = async (data: ScheduleGroupCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.createScheduleGroup,
    data,
  });
};

const publishScheduleGroups = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.publishScheduleGroup,
    data: idList,
  });
};

const unPublishScheduleGroups = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.unPublishScheduleGroup,
    data: idList,
  });
};

const publishScheduleDays = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.publishScheduleDay,
    data: idList,
  });
};

const unPublishScheduleDays = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.unPublishScheduleDay,
    data: idList,
  });
};

const openScheduleInstances = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.openScheduleInstances,
    data: idList,
  });
};

const closeScheduleInstances = async (idList: string[]): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingSchedule.closeScheduleInstances,
    data: idList,
  });
};

const getHospitals = async (): Promise<Hospital[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.hospital.get,
  });
  return result.data as Hospital[];
};

const getWorkingCalendars = async (
  hospitalId: string,
): Promise<WorkingCalendar[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.get}/${hospitalId}`,
  });
  return result.data as WorkingCalendar[];
};

const createWorkingCalendar = async (
  data: WorkingCalendarCM,
): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.workingCalendar.create,
    data,
  });
};
const deleteWorkingCalendar = async (
  id: WorkingCalendar['id'],
): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.workingCalendar.delete + id,
  });
};

const getWorkingCalendarDays = async (
  workingCalendarId: string,
): Promise<WorkingCalendarDay[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getDays}/${workingCalendarId}`,
  });
  return result.data as WorkingCalendarDay[];
};

const getWorkingCalendarIntervals = async (
  dayId: string,
): Promise<WorkingCalendarInterval[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getIntervals}/${dayId}`,
  });
  return result.data as WorkingCalendarInterval[];
};

const publishWorkingCalendars = async (idList: string[]): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.publish,
    data: idList,
  });
};

const cancelWorkingCalendars = async (idList: string[]): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.cancel,
    data: idList,
  });
};

const publishWorkingCalendarDays = async (idList: string[]): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.publishDays,
    data: idList,
  });
};
const cancelWorkingCalendarDays = async (idList: string[]): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.cancelDays,
    data: idList,
  });
};
const publishWorkingCalendarIntervals = async (
  idList: string[],
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.publishIntervals,
    data: idList,
  });
};
const cancelWorkingCalendarIntervals = async (
  idList: string[],
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.workingCalendar.cancelIntervals,
    data: idList,
  });
};
const checkSchedule = async (
  doctorId: Doctor['id'],
  fromDate: Date,
  toDate: Date,
  doctorName: Doctor['fullName'],
): Promise<DoctorStatusMap> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.csyt.workingCalendar.checkSchedule,
      params: {
        doctorId,
        fromDate,
        toDate,
      },
    });
    return {
      doctorName,
      status: result.status,
    };
  } catch (error) {
    return {
      doctorName,
      status: 400,
    };
  }
};

const workingScheduleService = {
  getScheduleGroupNames,
  getScheduleGroups,
  getScheduleDays,
  getScheduleInstances,
  createScheduleGroup,
  publishScheduleGroups,
  unPublishScheduleGroups,
  publishScheduleDays,
  unPublishScheduleDays,
  openScheduleInstances,
  closeScheduleInstances,
  getHospitals,
  getWorkingCalendars,
  createWorkingCalendar,
  deleteWorkingCalendar,
  publishWorkingCalendars,
  cancelWorkingCalendars,
  getWorkingCalendarDays,
  publishWorkingCalendarDays,
  cancelWorkingCalendarDays,
  getWorkingCalendarIntervals,
  publishWorkingCalendarIntervals,
  cancelWorkingCalendarIntervals,
  checkSchedule,
};

export default workingScheduleService;
