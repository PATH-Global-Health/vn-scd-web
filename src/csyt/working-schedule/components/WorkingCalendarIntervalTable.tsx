import React, { useEffect, useCallback } from 'react';
import { FiUnlock, FiLock } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';

import { useSelector, useDispatch, useFetchApi } from '@app/hooks';

import workingScheduleService from '../working-schedule.service';
import {
  WorkingCalendarInterval,
  WorkingCalendarStatus,
} from '../working-schedule.model';
import { getWorkingCalendarIntervals } from '../working-schedule.slice';
import { useTranslation } from 'react-i18next';

const WorkingCalendarIntervalTable: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedWorkingCalendarDay,
    workingCalendarIntervalList,
    getWorkingCalendarIntervalsLoading,
  } = useSelector((state) => state.csyt.workingSchedule);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedWorkingCalendarDay) {
      dispatch(getWorkingCalendarIntervals(selectedWorkingCalendarDay.id));
    }
  }, [dispatch, selectedWorkingCalendarDay]);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();

  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );
  const columns: Column<WorkingCalendarInterval>[] = [
    {
      accessor: 'from',
      header: t('Time'),
      render: (r) => `${r.from} - ${r.to}`,
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
        data={workingCalendarIntervalList}
        loading={getWorkingCalendarIntervalsLoading || fetching}
        rowActions={[
          {
            icon: <FiUnlock />,
            color: 'violet',
            title: t('Open'),
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarIntervals(
                  row.intervals.map((i) => i.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiLock />,
            color: 'yellow',
            title: t('Close'),
            hidden: (row): boolean => row.status !== POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarIntervals(
                  row.intervals.map((i) => i.id),
                ),
              ).then(getData);
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUnlock />,
            color: 'blue',
            title: t('Open selected interval'),
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarIntervals(
                  rows
                    .map((r) => r.intervals.map((i) => i.id))
                    .reduce((a, b) => [...a, ...b], []),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiLock />,
            color: 'red',
            title: t('Close selected interval'),
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarIntervals(
                  rows
                    .map((r) => r.intervals.map((i) => i.id))
                    .reduce((a, b) => [...a, ...b], []),
                ),
              ).then(getData);
            },
          },
        ]}
      />
    </>
  );
};

export default WorkingCalendarIntervalTable;
