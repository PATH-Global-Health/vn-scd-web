/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Header,
  Label,
  Loader,
  Modal,
} from 'semantic-ui-react';
import styled from 'styled-components';

import moment from 'moment';

import InfoRow from '@app/components/InfoRow';

import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';
import { selectExaminationSchedule } from '../examination.slice';
import { ExaminationStatus } from '../examination.model';
import examinationService from '../examination.service';
import { useTranslation } from 'react-i18next';

const ActionButtonsWrapper = styled.div`
  margin-top: 8px;
  position: relative;
`;

interface Props {
  onRefresh: () => void;
}

const BookingDetailsModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { onRefresh } = props;

  const dispatch = useDispatch();
  const {
    selectedSchedule: data,
    getExaminationSchedulesLoading,
  } = useSelector((s) => s.csyt.examination);

  const { FINISHED, CANCELED } = ExaminationStatus;
  const statusMap = useSelector((s) => s.csyt.examination.statusMap);

  const { fetch, fetching } = useFetchApi();

  const confirm = useConfirm();
  const [note, setNote] = useState('');
  const [resultDate, setResultDate] = useState<string>();
  const [result, setResult] = useState<string>();
  

  const handleUpdate = useCallback(
    (status: number) => {
      if (data) {
        confirm(t('Confirm status update ?'), async () => {
          await fetch(
            examinationService.updateExaminationSchedule(data.id, status, note),
          );
          onRefresh();
        });
      }
    },
    [fetch, data, onRefresh, note, confirm, t],
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleUpload = useCallback(() => {
    const fetchData = async () => {
      if (
        selectedFile &&
        data &&
        (data?.status === ExaminationStatus.RESULTED ||
          (data?.status === ExaminationStatus.FINISHED && resultDate && result && data?.service.id === 'f2490f62-1d28-4edd-362a-08d8a7232229') ||
          (data?.status === ExaminationStatus.FINISHED && data?.service.id === '9f9e8dd3-890e-4ae5-2952-08d92b03ae12')
        )
      ) {
        const formData = new FormData();
        if (
          data?.status === ExaminationStatus.FINISHED &&
          resultDate &&
          result
        ) {
          formData.append('ResultDate', resultDate);
          formData.append('Result', result);
        }
        formData.append('ExamId', data.id);
        formData.append('FormData', selectedFile);
        await fetch(
          data?.status === ExaminationStatus.RESULTED
            ? examinationService.updateResultForm(formData)
            : examinationService.createResultForm(formData),
        );
        setSelectedFile(undefined);
        dispatch(selectExaminationSchedule(undefined));
        onRefresh();
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [fetch, selectedFile, resultDate, result]);
  // const disableds = useMemo(() =>
  //   Boolean(
  //     (data?.status === ExaminationStatus.FINISHED &&
  //       (!result || !resultDate)) || !selectedFile),
  //   [data, result, resultDate, selectedFile],
  // );

  const disabled = useMemo(() => {
    if (data?.status === ExaminationStatus.FINISHED) {
      if (data?.service.id === '9f9e8dd3-890e-4ae5-2952-08d92b03ae12') {
        return (
          Boolean(!selectedFile))
      } else {
        return (
          Boolean(
            (!result || !resultDate)) || !selectedFile
        )
      }
    }
    return false;

  }, [data, result, resultDate, selectedFile])

  return (
    <Modal
      open={Boolean(data)}
      onClose={(): void => {
        dispatch(selectExaminationSchedule(undefined));
        setResult(undefined);
        setResultDate(undefined);
        setSelectedFile(undefined);
      }}
    >
      <Modal.Header>
        {data && (
          <Label
            basic
            size="large"
            color={statusMap[data.status].color}
            content={`${data.interval.numId} - ${statusMap[data.status].label}`}
          />
        )}
      </Modal.Header>
      <Modal.Content>
        {data && (
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header content={t('Appointment information')} />
                <InfoRow
                  label={t('Appointment time')}
                  content={`
                  ${data.interval.from}
                  |
                  ${moment(data.date).format('DD-MM-YYYY')}`}
                />
                <InfoRow label={t('Staff')} content={data.doctor.fullname} />
                <InfoRow label={t('Room')} content={data.room.name} />
                <InfoRow label={t('Note')} content={data.note} />
              </Grid.Column>
              <Grid.Column>
                <Header content={`${t('Service')}: ` + data.service.name} />
                <InfoRow label={t('Name')} content={data.customer.fullname} />
                <InfoRow
                  label={t('Date of birth')}
                  content={
                    data.customer.birthDate
                      ? moment(data.customer.birthDate).format('DD-MM-YYYY')
                      : ''
                  }
                />
                {/* <InfoRow
                  label="Hộ chiếu"
                  content={data.customer?.passportNumber ?? '...'}
                />
                <InfoRow
                  label="Quốc tịch"
                  content={data.customer?.nation ?? '...'}
                />
                <InfoRow label="Địa chỉ" content={data.customer.address} />
                <Header content="Thông tin xuất cảnh" />
                <InfoRow
                  label="Nơi đến"
                  content={data.exitInformation.destination}
                />
                <InfoRow
                  label="Thời gian xuất cảnh"
                  content={moment(data.exitInformation.exitingDate).format(
                    'hh:mm | DD-MM-YYYY',
                  )}
                />
                <InfoRow
                  label="Thời gian nhập cảnh"
                  content={moment(data.exitInformation.entryingDate).format(
                    'hh:mm | DD-MM-YYYY',
                  )}
                /> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Modal.Content>
      {data?.status === ExaminationStatus.UNFINISHED && (
        <Modal.Content>
          {!getExaminationSchedulesLoading && (
            <Form>
              <Form.TextArea
                label={t('Note')}
                disabled={fetching}
                onChange={(e, { value }) => setNote(value as string)}
              />
            </Form>
          )}
          {!getExaminationSchedulesLoading && (
            <ActionButtonsWrapper>
              <Dimmer active={fetching} inverted>
                <Loader inverted />
              </Dimmer>
              <Button
                color={statusMap[FINISHED].color}
                content={statusMap[FINISHED].label}
                onClick={() => handleUpdate(FINISHED)}
              />
              <Button
                color={statusMap[CANCELED].color}
                content={statusMap[CANCELED].label}
                onClick={() => handleUpdate(CANCELED)}
              />
            </ActionButtonsWrapper>
          )}
        </Modal.Content>
      )}
      <Modal.Content>
        <Form>
          {(data?.status === ExaminationStatus.FINISHED && data.service.id !== '9f9e8dd3-890e-4ae5-2952-08d92b03ae12') && (
            <Form.Group widths="equal">
              <Form.Input
                
                type="datetime-local"
                label={t('Result date')}
                onChange={(_, { value }) => setResultDate(value)}
              />
              <Form.Select
                fluid

                label={t('Result')}
                options={[t('Positive'), t('Negative')].map((e) => ({
                  text: e,
                  value: e,
                }))}
                onChange={(_, { value: v }) => setResult(v as string)}
              />
            </Form.Group>
          )}
          {(data?.status === ExaminationStatus.FINISHED ||
            data?.status === ExaminationStatus.RESULTED) && (
              <>
                <Form.Group>
                  <Form.Button

                    label={t('Result file')}
                    color="blue"
                    content={t('Select file')}
                    onClick={(e) => {
                      e.preventDefault();
                      if (fileRef?.current) {
                        fileRef.current.click();
                      }
                    }}
                  />
                  <Header as="h5">{selectedFile?.name}</Header>
                </Form.Group>
                <input
                  hidden
                  required
                  type="file"
                  ref={fileRef}
                  accept="application/pdf,application/vnd.ms-excel"
                  onChange={(e) => {
                    if (e.target !== null && e.target.files !== null) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <Form.Button
                  primary
                  loading={fetching}
                  disabled={disabled || fetching}
                  content={t('Submit')}
                  onClick={handleUpload}
                />
              </>
            )}
        </Form>
      </Modal.Content>
      {/* {data?.status === ExaminationStatus.RESULTED && (
        <Modal.Content>
          <ActionButtonsWrapper>
            <Dimmer active={fetching} inverted>
              <Loader inverted />
            </Dimmer>
            <Input
              type="file"
              accept="application/pdf,application/vnd.ms-excel"
              onChange={(e) => {
                if (e.target !== null && e.target.files !== null) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </ActionButtonsWrapper>
        </Modal.Content>
      )} */}
    </Modal>
  );
};

export default BookingDetailsModal;
