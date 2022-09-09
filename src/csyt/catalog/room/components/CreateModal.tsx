import React from 'react';
import { Button, Form, Label, Modal } from 'semantic-ui-react';

import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { useSelector } from '@app/hooks';

import roomService from '../room.service';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface Props {
  onToast: () => void;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { open, onClose, onRefresh } = props;
  const { register, handleSubmit, errors } = useForm();
  const { selectedHospital } = useSelector((s) => s.csyt.catalog.room);

  const onSubmit = async (data: any) => {
    try {
      await roomService.createRoom(data);
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Successful room create')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed room create')}
          type="failed"
        />,
      );
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>{t('Create new room')}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label className="requiredLabel">{t('Code')}</label>
              <input hidden name="unitId" defaultValue={selectedHospital?.id} ref={register}></input>
              <input name="code" ref={register(
                {
                  required: { value: true, message: t('Code not enter') },
                  minLength: { value: 8, message: t('Minimum 8 characters') },
                  maxLength: { value: 12, message: t('Maximum 12 characters') }
                })} />
              {errors.code &&
                <Label basic color='red' pointing>
                  {errors.code.message}
                </Label>
              }
            </Form.Field>
            <Form.Field>
              <label className="requiredLabel">{t('Name')}</label>
              <input name="name" ref={register(
                {
                  required: { value: true, message: t('No room name entered') },
                  minLength: { value: 8, message: t('Minimum 8 characters') },
                  maxLength: { value: 120, message: t('Maximum 120 characters') }
                }
              )} />
              {errors.name &&
                <Label basic color='red' pointing>
                  {errors.name.message}
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <Button primary type="submit" value="Save">{t('Submit')}</Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
