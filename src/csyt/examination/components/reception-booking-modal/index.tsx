/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useCallback } from 'react';
import { Button, DropdownItemProps, Modal, Select } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';
import { Interval } from '@csyt/working-schedule/working-schedule.model';
import { ExitInformation } from '@csyt/examination/examination.model';

import CustomerSection from './CustomerSection';
import ScheduleSection from './ScheduleSection';

import examinationService from '../../examination.service';
import { Customer } from '../../../catalog/customer/customer.model';
import customerService from '../../../catalog/customer/customer.service';
import { Service } from '@csyt/catalog/service/service.model';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ReceptionBookingModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const serviceList = useSelector(
    (state) => state.csyt.catalog.service.serviceList,
  );
  const {
    selectedHospital,
  } = useSelector((state) => state.csyt.examination);

  const optionService = [] as DropdownItemProps[];
  serviceList.map(s => optionService.push({ key: s.id, text: s.name, value: s.id }))
  const { open, onClose, onRefresh } = props;

  const [customer, setCustomer] = useState<Customer>();
  const [ticket, setTicket] = useState<Interval>();
  const [doctor, setDoctor] = useState<Doctor>();
  const [room, setRoom] = useState<Room>();
  const [date, setDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState<Service>();
  const [exitInformation] = useState<ExitInformation>({
    destination: 'string',
    entryingDate: "2021-10-04T05:27:45.841Z",
    exitingDate: "2021-10-04T05:27:45.841Z"
  });

  const bookedByUser = useSelector((state) => state.auth.userInfo?.id);
  // const { selectedHospital } = useSelector((s) => s.csyt.examination);
  const { fetch, fetching } = useFetchApi();
  const handleConfirm = useCallback(async () => {
    if (
      date &&
      customer &&
      ticket &&
      selectedHospital &&
      doctor &&
      room &&
      exitInformation
    ) {
      let customerId = '';
      if (customer.id !== '-1') {
        customerId = customer?.id;
      } else {
        customerId = await fetch(customerService.createCustomer(customer));
      }

      await fetch(
        examinationService.register(
          date,
          ticket,
          selectedHospital,
          exitInformation,
          { id: doctor.id, fullname: doctor?.description ?? '' },
          { id: room.id, name: room?.description ?? '' },
          {
            id: selectedService?.id!,
            name: selectedService?.name!,
          },
          {
            ...customer,
            id: customerId,
            phone: customer.phoneNumber,
            districtCode: customer.district,
            provinceCode: customer.province,
            wardCode: customer.ward,
            birthDate: customer.dateOfBirth,
          },
          bookedByUser,
        ),
      );
      onRefresh();
      onClose();
    }
  }, [
    fetch,
    date,
    selectedHospital,
    bookedByUser,
    customer,
    ticket,
    doctor,
    room,
    exitInformation,
    onRefresh,
    onClose,
    selectedService
  ]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header content={t('Receive')} />
        <Modal.Content>
          <CustomerSection onChange={setCustomer} loading={fetching} />
          <Select
            // text='Dịch vụ'
            placeholder={t('Service')}
            icon='wpforms'
            floating
            fluid
            labeled
            button
            className='icon'
            options={optionService}
            // value={selectedServiceId}
            onChange={(e, data: any) => {
              setSelectedService(serviceList.find(s => s.id === data.value))
            }}
          >
          </Select>
          {/* <CustomerExitSection
            onChange={setExitInformation}
            loading={fetching}
          /> */}
          {selectedService?.id && <ScheduleSection
            serviceId={selectedService?.id}
            onChange={(t, d, r, selectedDay) => {
              setTicket(t);
              setDoctor(d);
              setRoom(r);
              setDate(selectedDay);
            }}
            loading={fetching}
          />}
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            content={t('Submit')}
            loading={fetching}
            onClick={!fetching ? handleConfirm : () => { }}
            disabled={!customer || !ticket || !date
              // || !exitInformation
            }
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ReceptionBookingModal;
