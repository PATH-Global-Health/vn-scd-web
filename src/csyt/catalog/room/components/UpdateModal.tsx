import React from 'react';
import { Button, Form, Label, Modal } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import roomService from '../room.service';
import { Room } from '../room.model';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  data?: Room;
  onClose: () => void;
  onRefresh: () => void;
}


const UpdateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data, onClose, onRefresh } = props;
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data: any) => {
    try {
      await roomService.updateRoom(data);
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Successful room update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed room update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>{t('Room update')}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label className="requiredLabel">{t('Code')}</label>
              <input hidden name="id" defaultValue={data?.id} ref={register}></input>
              <input hidden name="unitId" defaultValue={data?.unitId} ref={register}></input>
              <input name="code" defaultValue={data?.code} ref={register(
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
              <input name="name" defaultValue={data?.name} ref={register(
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

export default UpdateModal;
