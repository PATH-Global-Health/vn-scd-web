import React, { useRef } from 'react';
import { Button, Form, Label, Loader, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { Doctor } from '../doctor.model';
import { useDispatch, useSelector } from '@app/hooks';
import { resetDefaultPassword, setResetDefaultPassword } from '../doctor.slice';
import { useTranslation } from 'react-i18next';

interface Props {
  data: Doctor;
  onClose: () => void;
  onRefresh: () => void;
}

const ResetPasswordModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { onClose, data } = props;
  const { watch } = useForm();

  const confirmPassword = useRef({});
  confirmPassword.current = watch('password', '');

  const dispatch = useDispatch();
  const { statusResetPassword, getdefaultPasswordLoading } = useSelector(
    (d) => d.csyt.catalog.doctor,
  );
  const handleResetDefaultPassword = async (doctorPhone: string) => {
    dispatch(resetDefaultPassword(doctorPhone));
    //  (doctorPhone);
  };

  return (
    <>
      <Modal open={Boolean(data)}>
        <Modal.Header>{t('Reset password')}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label>{t('Staff')}</label>
                <input value={data?.fullName}></input>
              </Form.Field>
              <Form.Field>
                <label>{t('PhoneNumber')}</label>
                <input value={data?.phone}></input>
              </Form.Field>
            </Form.Group>
            {getdefaultPasswordLoading ? (
              <Loader active inline="centered" />
            ) : // {
            statusResetPassword === 200 ? (
              <Form.Group widths="equal">
                <Form.Field>
                  <label>{t('New password')}</label>
                  <input value="Zaq@123ABC"></input>
                </Form.Field>
              </Form.Group>
            ) : (
              <Label>{t('Please Submit to reissue the password')}</Label>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            onClick={() => handleResetDefaultPassword(data?.phone)}
          >
            {t('Submit')}
          </Button>
          <Button
            onClick={() => {
              dispatch(setResetDefaultPassword(null));
              onClose();
            }}
          >
            {t('Close')}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
