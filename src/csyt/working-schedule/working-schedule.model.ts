import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';

export interface ScheduleGroup {
  Id: string;
  CreateGroup: string;
  Doctor: string;
  DoctorId: string;
  Room: string;
  RoomId: string;
  ServiceId: string[];
  ServiceView: string;
  FromDate: string;
  ToDate: string;
  FromHour: string;
  ToHour: string;
  Interval: number;
  LimitedDayView: number;
  ShowAfter: number;
  IsPublished: boolean;
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
}

export interface ScheduleGroupCM
  extends Omit<
    ScheduleGroup,
    'Id' | 'Doctor' | 'Room' | 'ServiceView' | 'IsPublished'
  > {
  AutoSchedule: boolean;
}

export interface ScheduleDay {
  Id: string;
  Date: string;
  Doctor: string;
  FromHour: string;
  ToHour: string;
  Interval: number;
  IsPublished: boolean;
  Room: string;
  ServiceView: string;
}

export interface ScheduleInstance {
  Id: string;
  Status: string;
  Time: string;
}

export enum WorkingCalendarStatus {
  NOT_POST = 0,
  POSTED = 1,
  CANCEL_POST = 2,
}
export interface DayCreateModel {
  date: string[];
  from: string;
  to: string;
}
export interface WorkingCalendar {
  id: string;
  description: string;
  from: string;
  fromDate: Date;
  to: string;
  toDate: Date;
  doctor: Doctor;
  room: Room;
  status: number;
  bookingAfterDate: number;
  bookingBeforeDate: number;
  fromTo: string;
}
interface Schedule {
  from: string;
  to: string;
}
export interface WorkingCalendarDay {
  id: string;
  status: number;
  date: Date;
  time: string;
  schedules: Schedule;
  doctor: Doctor;
  room: Room;
}
export interface Interval {
  id: string;
  from: string;
  to: string;
  isAvailable: boolean;
}
export interface WorkingCalendarInterval {
  id?: string;
  from: string;
  to: string;
  status: number;
  intervals: Interval[];
}
interface DoctorRoom {
  doctorId: string;
  roomId: string;
}
export interface WorkingCalendarCM {
  name: string;
  dayCreateModels: DayCreateModel[];
  interval: number;
  bookingBefore: number;
  bookingAfter: number;
  doctorRooms: DoctorRoom[];
  services: string[];
  fromDate?: Date;
  toDate?: Date;
  shiftCount: number;
  unitId: string;
}
export interface DoctorStatusMap {
  doctorName: string;
  status: number;
}
