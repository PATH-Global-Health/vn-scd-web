import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { FiCloudOff, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';
import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';

import { getRooms } from '@csyt/catalog/room/room.slice';
import {
  getWorkingCalendars,
  selectWorkingCalendar,
} from '../working-schedule.slice';
import CreateScheduleModal from './create-schedule-modal';
import {
  WorkingCalendar,
  WorkingCalendarStatus,
} from '../working-schedule.model';
import workingScheduleService from '../working-schedule.service';
import { useTranslation } from 'react-i18next';

const WorkingCalendarTable: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedHospital,
    workingCalendarList,
    getWorkingCalendarLoading,
  } = useSelector((state) => state.csyt.workingSchedule);
  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedHospital) {
      dispatch(getRooms(selectedHospital.id));
      dispatch(getWorkingCalendars(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);
  useEffect(getData, [getData]);

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();
  const [adding, setAdding] = useState(false);

  const columns: Column<WorkingCalendar>[] = [
    {
      accessor: 'description',
      header: t('Schedule name'),
      render: ({ description }): React.ReactNode => description,
    },
    {
      accessor: 'fromDate',
      header: t('From date'),
      render: (row): React.ReactNode =>
        `${moment(row.fromDate).format('DD-MM-YYYY')}`,
    },
    {
      accessor: 'toDate',
      header: t('To date'),
      render: (row): React.ReactNode =>
        `${moment(row.toDate).format('DD-MM-YYYY')}`,
    },
    {
      accessor: 'fromTo',
      header: t('Interval'),
      render: (row): React.ReactNode => row.fromTo,
    },
    {
      accessor: 'bookingBeforeDate',
      header: t('Pre-booking'),
      render: ({ bookingBeforeDate }): React.ReactNode =>
        `${bookingBeforeDate} ${t('day')}`,
    },
    {
      accessor: 'bookingAfterDate',
      header: t('Post-booking'),
      render: ({ bookingAfterDate }): React.ReactNode =>
        `${bookingAfterDate} ${t('day')}`,
    },
    {
      accessor: 'room',
      header: t('Room'),
      render: (row) => row.room.name,
    },
    {
      accessor: 'doctor',
      header: t('Staff'),
      render: (row) => row.doctor.fullName,
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
        data={workingCalendarList}
        loading={fetching || getWorkingCalendarLoading}
        onRowClick={(row): void => {
          dispatch(selectWorkingCalendar(row));
        }}
        rowActions={[
          {
            icon: <FiUploadCloud />,
            color: 'violet',
            title: t('Post schedule'),
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendars([row.id]),
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
                workingScheduleService.cancelWorkingCalendars([row.id]),
              ).then(getData);
            },
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: t('Delete schedule'),
            onClick: (row): void => {
              confirm(t('Delete this calendar ?'), async () => {
                await fetch(
                  workingScheduleService.deleteWorkingCalendar(row.id),
                );
                getData();
              });
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUploadCloud />,
            color: 'blue',
            title: t('Post selected schedule'),
            disabled: workingCalendarList.every((e) => e.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendars(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'red',
            title: t('Cancel selected schedule'),
            disabled: workingCalendarList.every((e) => e.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendars(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiPlus />,
            color: 'green',
            title: t('Create schedule'),
            onClick: (): void => setAdding(true),
          },
        ]}
      />

      <CreateScheduleModal
        open={adding}
        onClose={(): void => setAdding(false)}
        onCreateFinish={getData}
      />
    </>
  );
};

export default WorkingCalendarTable;
