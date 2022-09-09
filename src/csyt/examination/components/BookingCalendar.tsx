import React, { useCallback, useMemo } from 'react';

import moment from 'moment';

import { useSelector, useDispatch } from '@app/hooks';
import ScheduleCalendar, { Agenda } from '@app/components/schedule-calendar';

import { selectExaminationSchedule, setFromTo } from '../examination.slice';
import { useTranslation } from 'react-i18next';

const BookingCalendar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const examinationScheduleList = useSelector(
    (state) => state.csyt.examination.examinationScheduleList,
  );
  const agendaList = useMemo(
    (): Agenda[] =>
      examinationScheduleList.map((v) => ({
        date: moment(v.date).toDate(),
        id: v.id,
        status: v.status,
        time: v.interval.from,
        serviceName: v.service.name,
        infoList: [
          {
            name: 'numId',
            label: t('Form code'),
            content: `${v.interval.numId}`,
          },
          {
            name: 'serviceName',
            label: t('Service name'),
            content: `${v.service.name}`,
          },
          {
            name: 'customerName',
            label: t('Name'),
            content: v.customer.fullname,
          },
          {
            name: 'customerBirthday',
            label: t('Date of birth'),
            content: moment(v.customer.birthDate).format('DD-MM-YYYY'),
          },
          {
            name: 'doctorName',
            label: t('Staff'),
            content: v.doctor.fullname,
          },
          {
            name: 'roomName',
            label: t('Room'),
            content: v.room.name,
          },
        ],
      })),
    [examinationScheduleList, t],
  );

  const onAgendaClick = useCallback(
    (id: Agenda['id']) => {
      dispatch(
        selectExaminationSchedule(
          examinationScheduleList.find((v) => v.id === id)?.id,
        ),
      );
    },
    [dispatch, examinationScheduleList],
  );

  const { getExaminationSchedulesLoading, from } = useSelector(
    (state) => state.csyt.examination,
  );

  const statusMap = useSelector((state) => state.csyt.examination.statusMap);

  return (
    <>
      <ScheduleCalendar
        loading={getExaminationSchedulesLoading}
        weekStartDate={from}
        agendaList={agendaList}
        onAgendaClick={onAgendaClick}
        statusMap={statusMap}
        onWeekChange={(f, t) => dispatch(setFromTo({ from: f, to: t }))}
      />
    </>
  );
};

export default BookingCalendar;
