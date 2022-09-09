import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  Form,
  Header,
  Grid,
  Button,
  Label,
  // Message,
} from 'semantic-ui-react';

import moment from 'moment';
// import { v4 as uuidv4 } from 'uuid';

import { DatePicker } from '@app/components/date-picker';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useFetchApi, useSelector } from '@app/hooks';

import ExaminationServicePicker from './ExaminationServicePicker';
import DaysInWeekList, { ScheduleWeekDays } from './DaysInWeekList';
import DoctorRoomList, { DoctorRoom } from './DoctorRoomList';

import {
  DayCreateModel,
  // DoctorStatusMap,
  WorkingCalendarCM,
} from '../../working-schedule.model';
import workingScheduleService from '../../working-schedule.service';
import { useTranslation } from 'react-i18next';

interface DddFormat {
  ddd: string;
  from: string;
  to: string;
}
interface DateList {
  date: string;
  ddd: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  onCreateFinish: () => void;
}

const CreateScheduleModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { open, onClose, onCreateFinish } = props;
  const { selectedHospital } = useSelector((s) => s.csyt.workingSchedule);

  const [createGroup, setCreateGroup] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [interval, setInterval] = useState(0);
  const [shiftCount, setShiftCount] = useState(1);
  const [limitedDayView, setLimitedDayView] = useState(0);
  const [showAfter, setShowAfter] = useState(0);

  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [daysInWeekList, setDaysInWeekList] = useState<ScheduleWeekDays[]>([]);
  const [doctorRoomList, setDoctorRoomList] = useState<DoctorRoom[]>([]);
  // const [checkedError, setCheckedError] = useState<boolean>(false);
  // const [checkedResponse, setCheckedResponse] = useState<DoctorStatusMap[]>([]);

  const { fetching } = useFetchApi();

  const handleConfirm =



    // useCallback(
    async () => {
      try {
        const name = createGroup;
        let tmpDayCreateModels: DayCreateModel[] = [];
        const dayCreateModels: DayCreateModel[] = [];
        if (fromDate && toDate) {
          const dateList: DateList[] = [];
          const startOfFromDate = moment(fromDate).startOf('days').clone();
          const startOfToDate = moment(toDate).startOf('days');
          while (startOfFromDate.isSameOrBefore(startOfToDate)) {
            dateList.push({
              date: startOfFromDate.format('YYYY-MM-DD'),
              ddd: startOfFromDate.format('ddd'),
            });
            startOfFromDate.add(1, 'days');
          }
          const selectingDDD: DddFormat[] = [];
          daysInWeekList.map((diw) => {
            if (diw.Mon)
              selectingDDD.push({
                ddd: 'T2',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Tue)
              selectingDDD.push({
                ddd: 'T3',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Wed)
              selectingDDD.push({
                ddd: 'T4',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Thu)
              selectingDDD.push({
                ddd: 'T5',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Fri)
              selectingDDD.push({
                ddd: 'T6',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Sat)
              selectingDDD.push({
                ddd: 'T7',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            if (diw.Sun)
              selectingDDD.push({
                ddd: 'CN',
                from: diw.FromHour,
                to: diw.ToHour,
              });
            return selectingDDD;
          });
          tmpDayCreateModels = selectingDDD.map((s) => ({
            ...s,
            date: dateList.filter((d) => d.ddd === s.ddd).map((d) => d.date),
            ddd: undefined,
          }));

          tmpDayCreateModels.forEach((e) => {
            const existing = dayCreateModels.filter((v) => {
              return v.from === e.from && v.to === e.to;
            });
            if (existing.length) {
              const existingIndex = dayCreateModels.indexOf(existing[0]);
              dayCreateModels[existingIndex].date = [
                ...dayCreateModels[existingIndex].date,
                ...e.date,
              ];
            } else {
              if (typeof e.date === 'string') {
                e.date = [e.date];
              }
              dayCreateModels.push(e);
            }
          });
        }
        const creatingData: WorkingCalendarCM = {
          name,
          bookingBefore: limitedDayView,
          bookingAfter: showAfter,
          interval,
          dayCreateModels,
          doctorRooms: doctorRoomList.map((dr) => ({
            doctorId: dr.Doctor.id,
            roomId: dr.Room.id,
          })),
          services: serviceIds,
          fromDate,
          toDate,
          shiftCount,
          unitId: selectedHospital?.id ?? '',
        };

        // if (fromDate && toDate) {
        // const result = await Promise.all(
        //   doctorRoomList.map((dr) =>
        //     workingScheduleService.checkSchedule(
        //       dr.Doctor.id,
        //       fromDate,
        //       toDate,
        //       dr.Doctor.fullName,
        //     ),
        //   ),
        // );
        // setCheckedResponse(result);
        // if (result.filter((res) => res.status === 200).length > 0) {
        //   setCheckedError(true);
        // } else {
        //   setCheckedError(false);
        await
          // fetch(
          workingScheduleService.createWorkingCalendar(creatingData)
        // );
        onCreateFinish();
        onClose();
        toast(
          <ToastComponent
            content={t('Successful working schedule create')}
            type="success"
          />,
        );
      } catch (error) {
        toast(
          <ToastComponent
            content={t('Failed working schedule create')}
            type="failed"
          />,
        );
      }
    }
  // }
  // }
  // , [
  //   fetch,
  //   onClose,
  //   onCreateFinish,
  //   serviceIds,
  //   daysInWeekList,
  //   doctorRoomList,
  //   createGroup,
  //   fromDate,
  //   toDate,
  //   interval,
  //   limitedDayView,
  //   showAfter,
  //   shiftCount,
  //   selectedHospital,
  // ]
  // );

  const disableConfirmButton = useMemo((): boolean => {
    if (
      daysInWeekList.length === 0 ||
      doctorRoomList.length === 0 ||
      serviceIds.length === 0 ||
      !createGroup ||
      !fromDate ||
      !toDate
    ) {
      return true;
    }
    return false;
  }, [
    daysInWeekList,
    doctorRoomList,
    serviceIds,
    createGroup,
    fromDate,
    toDate,
  ]);

  // const modifiers = {
  //   fromDate: fromDate,
  //   toDate: toDate,
  // };

  // const modifiersStyles = {
  //   fromDate: {
  //     color: '#cf874b',
  //     fontWeight: 'bold',
  //     backgroundColor: '#f1d6ac',
  //   },
  //   toDate: {
  //     color: '#cf874b',
  //     fontWeight: 'bold',
  //     backgroundColor: '#f1d6ac',
  //   },
  // };

  useEffect(() => {
    if (!limitedDayView) setLimitedDayView(0);
    if (!showAfter) setShowAfter(0)
  }, [limitedDayView, showAfter])

  return (
    <>
      <Modal open={open}>
        <Modal.Header content={t('Create schedule')} />
        <Modal.Content>
          <Form loading={fetching}>
            <Header content={t('Information')} />
            <Form.Group widths="equal">
              <Form.Input
                required
                label={t('Schedule name')}
                onChange={(e, { value }) => setCreateGroup(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                control={DatePicker}
                label={t('Start date')}
                disabledDays={(d: Date) =>
                  moment(new Date()).format('YYYY-MM-DD') > moment(d).format('YYYY-MM-DD')
                }
                onChange={(value: Date) => setFromDate(value)}
              />
              <Form.Field
                required
                control={DatePicker}
                label={t('End date')}
                disabledDays={(d: Date) =>
                  moment(fromDate).format('YYYY-MM-DD') > moment(d).format('YYYY-MM-DD')
                }
                onChange={(value: Date) => setToDate(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                required
                label={t('Timing (minutes)')}
                type="number"
                onChange={(e, { value }) => {
                  setInterval(() => parseInt(value, 10));
                }}
              />
              <Form.Input
                label={t('Repeat time')}
                type="number"
                value={shiftCount}
                onChange={(e, { value }) => {
                  setShiftCount(() => parseInt(value, 10));
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              {/* <Form.Field>
                <label>Cho phép đặt trước (ngày)</label>
                <input type='number' onChange={(e) => setLimitedDayView(() => parseInt(e.target?.value, 10))}></input>
              </Form.Field>

              <Form.Field>
                <label>Cho phép đặt sau (ngày)</label>
                <input max={limitedDayView} type='number'
                  onChange={(e) => {
                    setShowAfter(() =>
                      parseInt(e.target?.value, 10))
                  }}></input>
                
              </Form.Field> */}



              <Form.Input
                required
                label={t('Pre-booking is allowed (days)')}
                type="number"
                value={limitedDayView}
                min={0}
                onChange={(e, { value }) => {
                  setLimitedDayView(() => parseInt(value, 10));
                }}
              />
              <Form.Field>
                <Form.Input
                  required
                  label={t('Post-booking is allowed (days)')}
                  type="number"
                  value={showAfter}
                  min={0}
                  onChange={(e, { value }) => {
                    setShowAfter(() => parseInt(value, 10));
                  }}
                />
                {limitedDayView < showAfter ?
                  <Label pointing prompt>
                    {t('The next booking date must be smaller than the previous booking date')}
                  </Label> : ''}
              </Form.Field>
            </Form.Group>

            {limitedDayView < showAfter ? ''
              : <Form.Group>
                <DayPicker
                  className="range-picker"
                  numberOfMonths={1}
                  selectedDays={{ from: moment(new Date()).add(showAfter, 'days').toDate(), to: moment(new Date()).add(limitedDayView, 'days').toDate() }}
                // modifiersStyles={modifiersStyles}
                // modifiers={modifiers}
                // onDayClick={handleDayClick}
                />
              </Form.Group>}
            <ExaminationServicePicker selectedIdList={serviceIds} onChange={setServiceIds} />

            <Grid columns={2}>
              <Grid.Column>
                <DaysInWeekList onChange={setDaysInWeekList} />
              </Grid.Column>
              <Grid.Column>
                {/* {checkedError && (
                  <Message negative size="tiny">
                    <p>
                      {`Bác sĩ ${checkedResponse
                        .filter((res) => res.status === 200)
                        .map((res) => res.doctorName)
                        .join(', ')} đã có lịch từ trước`}
                    </p>
                  </Message>
                )} */}
                <DoctorRoomList
                  onClearError={() => { }}
                  onChange={setDoctorRoomList}
                />
              </Grid.Column>
            </Grid>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {limitedDayView < showAfter ? '' :
            <Button
              primary
              content={t('Submit')}
              disabled={disableConfirmButton}
              onClick={handleConfirm}
            />}
          <Button content={t('Cancel')} onClick={() => { setFromDate(undefined); setToDate(undefined); onClose() }} />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default CreateScheduleModal;
