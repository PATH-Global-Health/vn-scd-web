import React, { useState, useEffect } from 'react';
import {
  Dimmer,
  Form,
  Header,
  Label,
  Loader,
  Segment,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { DatePicker } from '@app/components/date-picker';

import { useSelector, useDispatch } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';
import {
  Interval,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';
import {
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
} from '@csyt/examination/examination.slice';
import { useTranslation } from 'react-i18next';

const TicketWrapper = styled(Segment)`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-left: -4px;
  margin-right: -4px;
  .label {
    width: 67px;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    margin: 4px !important;
  }
`;

interface Props {
  onChange: (
    interval: Interval,
    doctor: Doctor,
    room: Room,
    date: Date,
  ) => void;
  serviceId: string;
  loading?: boolean;
}

const ScheduleSection: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { loading } = props;
  const dispatch = useDispatch();

  const [selectedDay, setSelectedDay] = useState<Date>();

  const {
    selectedHospital,
    availableReceptionDayList,
    getAvailableReceptionDayLoading,
    availableReceptionIntervalList,
    getAvailableReceptionIntervalLoading,
  } = useSelector((state) => state.csyt.examination);

  useEffect(() => {
    if (selectedHospital && props.serviceId) {
      dispatch(getAvailableReceptionDays({ unitId: selectedHospital.id, serviceId: props.serviceId }));
    }
  }, [selectedHospital, dispatch, props.serviceId]);

  useEffect(() => {
    if (selectedDay) {
      const selectedDayId = availableReceptionDayList.find((wcd) =>
        moment(wcd.date).isSame(selectedDay, 'day'),
      )?.id;
      if (selectedDayId) {
        dispatch(getAvailableReceptionIntervals(selectedDayId));
      }
    }
  }, [dispatch, selectedDay, availableReceptionDayList]);

  const [ticketList, setTicketList] = useState<WorkingCalendarInterval[]>([]);
  useEffect(() => setTicketList([]), [selectedDay]);
  useEffect(() => {
    setTicketList(
      availableReceptionIntervalList.map((wci) => ({ ...wci, id: uuidv4() })),
    );
  }, [availableReceptionIntervalList]);

  const [doctor, setDoctor] = useState<Doctor>();
  const [room, setRoom] = useState<Room>();

  const daySelectNode = (
    <Form.Field
      fluid
      label={t('Date')}
      name="availableDay"
      control={DatePicker}
      onChange={(date: Date) => {
        setSelectedDay(date);
        setDoctor(
          availableReceptionDayList.find((d) =>
            moment(d.date).isSame(moment(date), 'date'),
          )?.doctor,
        );
        setRoom(
          availableReceptionDayList.find((d) =>
            moment(d.date).isSame(moment(date), 'date'),
          )?.room,
        );
      }}
      disabled={getAvailableReceptionDayLoading}
      disabledDays={(d: Date) =>
        !(availableReceptionDayList.length === 0
          ? []
          : availableReceptionDayList
        )
          .map((ad) => moment(ad.date).format('YYYY-MM-DD'))
          .includes(moment(d).format('YYYY-MM-DD'))
      }
    />
  );

  const [selectedTicketId, setSelectedTicketId] = useState<
    WorkingCalendarInterval['id']
  >();
  const { onChange } = props;
  const ticketListFiltered = ticketList
    .filter((t) => {
      if (
        moment(selectedDay).isSame(moment(), 'date') &&
        moment().isAfter(moment(t.from, 'hh:mm'))
      ) {
        return null;
      }
      return t;
    })
    .filter((t) => t.intervals.filter((i) => i.isAvailable).length > 0);
  const ticketListNode = (
    <TicketWrapper>
      {(getAvailableReceptionIntervalLoading || loading) && (
        <Dimmer active inverted>
          <Loader inverted />
        </Dimmer>
      )}
      {ticketListFiltered.map((t) => (
        <Label
          color="violet"
          basic={t.id !== selectedTicketId}
          key={t.id}
          onClick={() => {
            setSelectedTicketId(t.id);
            const firstAvailableInterval = t.intervals.find(
              (it) => it.isAvailable,
            );
            if (firstAvailableInterval && doctor && room && selectedDay) {
              onChange(firstAvailableInterval, doctor, room, selectedDay);
            }
          }}
        >
          {t.from}
        </Label>
      ))}
      {ticketListFiltered.length === 0 &&
        selectedDay &&
        !(getAvailableReceptionIntervalLoading || loading) && (
          <Header
            as="h4"
            color="red"
            content={t('The schedule of the day has expired, please choose another date!')}
          />
        )}
    </TicketWrapper>
  );

  return (
    <>
      {availableReceptionDayList.length > 0 &&
        <>
          <Form loading={loading}>
            <Header content="" />
            <Form.Group widths="equal">{daySelectNode}</Form.Group>
          </Form>
          {ticketListNode}
        </>
      }
    </>
  );
};

export default ScheduleSection;
