import { httpClient, apiLinks } from '@app/utils';
import moment from 'moment';
import {
  Interval,
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';
import { Customer } from '@csyt/catalog/customer/customer.model';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import {
  ExaminationSchedule,
  ExaminationStatistic,
  ExitInformation,
  PaginationSchedule,
} from './examination.model';
import { InjectionObject } from '@csyt/catalog/injection-object/injection-object.model';

const getExaminationSchedules = async (
  from: Date,
  to: Date,
  unitId: string,
): Promise<PaginationSchedule<ExaminationSchedule>> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getSchedules,
    params: {
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD'),
      unitId,
    },
  });

  return result.data as PaginationSchedule<ExaminationSchedule>;
};

const updateExaminationSchedule = async (
  id: string,
  status: number,
  note?: string,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.examination.updateSchedule,
    data: { id, status, note },
  });
};

const getAvailableDateForExport = async (unitId: string): Promise<Date[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getAvailableDateForExport,
    params: { unitId },
  });
  return result.data as Date[];
};

const exportExamReport = async (
  unitId: string,
  dateTaken: Date,
): Promise<void> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.exportExamReport,
    responseType: 'blob',
    params: {
      unitId,
      dateTaken: moment(dateTaken).format('YYYY-MM-DD'),
    },
  });

  const url = window.URL.createObjectURL(new Blob([result.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `report-${moment(dateTaken).format('DD-MM-YYYY')}.xlsx`,
  );
  document.body.appendChild(link);
  link.click();
};

const register = async (
  date: Date,
  interval: Interval,
  unit: CSYTHospital | AdminHospital,
  exitInformation: ExitInformation,
  doctor: { id: string; fullname: string },
  room: { id: string; name: string },
  service: { id: string; name: string },
  customer: Customer,
  bookedByUser?: string,
  // _serviceId?: number,
): Promise<ExaminationSchedule> => {
  const result = await httpClient.post({
    url: apiLinks.csyt.examination.register,
    data: {
      date,
      interval,
      unit,
      exitInformation,
      doctor,
      room,
      service,
      customer,
      bookedByUser,
    },
  });

  return result.data as ExaminationSchedule;
};

const getAvailableWorkingCalendar = async (
  serviceId: string,
  unitId: string,
): Promise<WorkingCalendar[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.workingCalendar.getAvailableWorkingCalendar,
    params: {
      serviceId,
      unitId,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as WorkingCalendar[];
};

const getAvailableReceptionDays = async (
  unitId: string,
  serviceId: string,
): Promise<WorkingCalendarDay[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getDaysByUnitAndService}`,
    params: {
      serviceId: serviceId,
      // 'f2490f62-1d28-4edd-362a-08d8a7232229',
      unitId,
    },
  });
  return result.data as WorkingCalendarDay[];
};

const getAvailableReceptionIntervals = async (
  dayId: string,
): Promise<WorkingCalendarInterval[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getIntervals}/${dayId}`,
  });
  return result.data as WorkingCalendarInterval[];
};

const getAvailableDoctorIds = async (
  hospitalId: string,
  date: Date,
): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getAvailableDoctors(
      hospitalId,
      moment(date).format('YYYY-MM-DD'),
    ),
  });
  return result.data as string[];
};

const getBookingAvailableDays = async (
  hospitalId: string,
): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getAvailableDays(hospitalId),
  });

  return result.data as string[];
};

const createResultForm = async (data: FormData): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.csyt.examination.createResultForm,
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  } catch (error) {}
};

const updateResultForm = async (data: FormData): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.csyt.examination.updateResultForm,
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  } catch (error) {}
};

const getExaminationStatistic = async (
  from: Date,
  to: Date,
  unitId: string,
): Promise<ExaminationStatistic> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getStatistic,
    params: {
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD'),
      unitId,
    },
  });

  return result.data as ExaminationStatistic;
};

const getInjectionObjects = async (): Promise<InjectionObject[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.examination.getInjectionObjects,
  });

  return result.data as InjectionObject[];
};

const examinationService = {
  getExaminationSchedules,
  updateExaminationSchedule,
  getAvailableDateForExport,
  exportExamReport,
  register,
  getAvailableWorkingCalendar,
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
  getBookingAvailableDays,
  getAvailableDoctorIds,
  createResultForm,
  updateResultForm,
  getExaminationStatistic,
  getInjectionObjects,
};

export default examinationService;
