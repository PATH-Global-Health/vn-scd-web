/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';

import styled from 'styled-components';

import moment from 'moment';

import DataTable, { Column } from '@app/components/data-table';
import SearchBar, { filterArray } from '@app/components/SearchBar';
import { WeekPicker } from '@app/components/date-picker';

import { useSelector, useDispatch } from '@app/hooks';
import { selectExaminationSchedule, setFromTo } from '../examination.slice';

import { ExaminationScheduleTableVM } from '../examination.model';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  padding: 6px;
`;
const SearchBarWrapper = styled.div`
  padding-bottom: 6px;
`;

const StatisticTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    statusMap,
    examinationScheduleList,
    getExaminationSchedulesLoading,
    from,
  } = useSelector((state) => state.csyt.examination);

  const columns = useMemo(
    (): Column<ExaminationScheduleTableVM>[] => [
      {
        accessor: 'numId',
        header: t('Form code'),
        aggregate: 'count',
        renderAggregated: ({ value }) => `${t('Sum')}: ${value as string}`,
      },
      {
        accessor: 'customerName',
        header: t('Name'),
      },
      { accessor: 'customerBirthday', header: t('Date of birth') },
      { accessor: 'roomName', header: t('Room') },
      { accessor: 'doctorName', header: t('Staff') },
      { accessor: 'date', header: t('Date') },
      { accessor: 'time', header: t('Hour') },
      { accessor: 'status', header: t('Status') },
      { accessor: 'bookedByUser', header: t('Booking account') },
    ],
    [t],
  );

  const [searchValue, setSearchValue] = useState('');
  const data = useMemo(
    (): ExaminationScheduleTableVM[] =>
      filterArray(
        examinationScheduleList
          .slice()
          .sort((a, b) =>
            a.date === b.date
              ? a.interval.from > b.interval.from
                ? 1
                : -1
              : a.date > b.date
              ? 1
              : -1,
          )
          .map((s) => ({
            id: s.id,
            numId: s.interval.numId,
            customerName: s.customer.fullname,
            customerBirthday: moment(s.customer.birthDate).format('DD-MM-YYYY'),
            serviceName: s.service.name,
            roomName: s.room.name,
            doctorName: s.doctor.fullname,
            date: moment(s.date).format('DD-MM-YYYY'),
            time: s.interval.from,
            bookedByUser: s.bookedByUser,
            status: statusMap[s.status].label,
            note: s.note,
          })),
        searchValue,
      ),
    [examinationScheduleList, searchValue, statusMap],
  );

  return (
    <Wrapper>
      <SearchBarWrapper>
        <SearchBar onChange={setSearchValue} />
      </SearchBarWrapper>
      <DataTable
        loading={getExaminationSchedulesLoading}
        title={
          <WeekPicker
            weekStartDate={from}
            onChange={(ft) => dispatch(setFromTo(ft))}
          />
        }
        columns={columns}
        data={data}
        groupBy
        onRowClick={(r) => dispatch(selectExaminationSchedule(r.id))}
      />
    </Wrapper>
  );
};

export default StatisticTable;
