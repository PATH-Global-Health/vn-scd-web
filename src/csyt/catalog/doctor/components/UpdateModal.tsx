/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import doctorService from '../doctor.service';
import { Doctor } from '../doctor.model';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  data?: Doctor;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data, onClose, onRefresh } = props;
  const { register, handleSubmit, errors } = useForm();
  const genderOptions = [
    { key: 'male', value: true, text: t('Male') },
    { key: 'female', value: false, text: t('Female') },
  ]

  const [genderDoctor, setGenderDoctor] = useState(data?.gender!);
  const onSubmit = async (data: Doctor) => {
    try {
      await doctorService.updateDoctor({ ...data, gender: genderDoctor });
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Successful staff update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed staff update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>{t('Staff update')}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label className="requiredLabel">{t('Code')}</label>
              <input name="id" hidden defaultValue={data?.id} ref={register}></input>
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
              <input name="fullName" defaultValue={data?.fullName} ref={register(
                {
                  required: { value: true, message: t('No staff name entered') },
                  minLength: { value: 4, message: t('Minnimun is 4 characters') },
                  maxLength: { value: 35, message: t('Maximum is 35 characters') }
                }
              )} />
              {errors.fullName &&
                <Label basic color='red' pointing>
                  {errors.fullName.message}
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label className="requiredLabel">{t('Identity card')}</label>
              <input name="identityCard" defaultValue={data?.identityCard} ref={register(
               {
                required: { value: true, message: t('No identity card entered') },
                minLength: { value: 9, message: t('Minimum 8 characters') },
                maxLength: { value: 12, message: t('Maximum 12 characters') },
                pattern: { value: /^[0-9\b]+$/, message: t('Identity card contain digits from 0 -> 9') }
              }
              )} />
              {errors.identityCard &&
                <Label basic color='red' pointing>
                  {errors.identityCard.message}
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>{t('Title')}</label>
              <input name="title" defaultValue={data?.title} ref={register({
                maxLength: { value: 30, message: t('Maximum 30 characters') }
              })} />
            </Form.Field>

            <Form.Field>
              <label>{t('Academic Title')}</label>
              <input name="academicTitle" defaultValue={data?.academicTitle} ref={register({
                maxLength: { value: 30, message: t('Maximum 30 characters') }
              })} />
            </Form.Field>

            <Form.Field>
              <label className="requiredLabel">{t('Gender')}</label>
              <Select
                // placeholder='Chọn giới tính'
                options={genderOptions}
                defaultValue={data?.gender}
                onChange={(e: any, d: any) => setGenderDoctor(d.value)}
              />
            </Form.Field>

            <Form.Field>
              <label>{t('Email')}</label>
              <input name="email" defaultValue={data?.email} ref={register(
                {
                  // required: { value: true, message: 'Chưa nhập email' },
                  minLength: { value: 4, message: t('Minnimun is 4 characters') },
                  maxLength: { value: 120, message: t('Maximum 120 characters') },
                  pattern: { value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: t('Enter the wrong email format') }
                }
              )} />
              {errors.email &&
                <Label basic color='red' pointing>
                  {errors.email.message}
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>{t('PhoneNumber')}</label>
              <input readOnly name="phone" defaultValue={data?.phone} ref={register(
                {
                  required: { value: true, message: t('Phone number not enterd') },
                  minLength: { value: 10, message: t('Minimum 10 numbers') },
                  maxLength: { value: 11, message: t('Maximum 11 numbers') },
                  pattern: { value: /^[0-9\b]+$/, message: t('Phone numbers contain digits from 0 -> 9') }
                }
              )} />
              {errors.phone &&
                <Label basic color='red' pointing>
                  {errors.phone.message}
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
