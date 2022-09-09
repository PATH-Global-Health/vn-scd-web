import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import { FiUploadCloud, FiCloudOff } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';

import { useSelector, useDispatch, useFetchApi } from '@app/hooks';
import {
  getWorkingCalendarDays,
  selectWorkingCalendarDay,
} from '../working-schedule.slice';
import workingScheduleService from '../working-schedule.service';
import {
  WorkingCalendarDay,
  WorkingCalendarStatus,
} from '../working-schedule.model';
import { useTranslation } from 'react-i18next';

const WorkingCalendarDayTable: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedWorkingCalendar,
    workingCalendarDayList,
    getWorkingCalendarDaysLoading,
  } = useSelector((state) => state.csyt.workingSchedule);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedWorkingCalendar) {
      dispatch(getWorkingCalendarDays(selectedWorkingCalendar.id));
    }
  }, [dispatch, selectedWorkingCalendar]);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();

  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );

  const columns: Column<WorkingCalendarDay>[] = [
    {
      accessor: 'date',
      header: t('Date'),
      render: (row) => moment(row.date).format('DD/MM/YYYY'),
    },
    {
      accessor: 'schedules',
      header: t('Time'),
      render: (r): string => `${r.schedules.from} - ${r.schedules.to}`,
    },
    {
      accessor: 'time',
      header: t('Examination time'),
      render: (r) => `${r.time} ${t('minute')}`,
    },
    {
      accessor: 'room',
      header: t('Room'),
      render: (row) => row.room.description,
    },
    {
      accessor: 'doctor',
      header: t('Staff'),
      render: (row) => row.doctor.description,
    },
    {
      accessor: 'status',
      header: t('Status'),
      render: (row): React.ReactNode => statusMap[row.status].label,
    },
  ];

  return (
    <>
      <DataTable
        search
        selectable
        columns={columns}
        data={workingCalendarDayList}
        loading={getWorkingCalendarDaysLoading || fetching}
        onRowClick={(row): void => {
          dispatch(selectWorkingCalendarDay(row));
        }}
        rowActions={[
          {
            icon: <FiUploadCloud />,
            color: 'violet',
            title: t('Post schedule'),
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarDays([row.id]),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'yellow',
            title: t('Cancel shedule'),
            hidden: (row): boolean => row.status !== POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarDays([row.id]),
              ).then(getData);
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUploadCloud />,
            color: 'blue',
            title: t('Post selected schedule'),
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarDays(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'red',
            title: t('Cancel selected schedule'),
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarDays(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
        ]}
      />
    </>
  );
};

export default WorkingCalendarDayTable;
