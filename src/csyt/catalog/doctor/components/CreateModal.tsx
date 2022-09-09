/* eslint-disable no-useless-escape */
import React, { useRef, useState } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import doctorService from '../doctor.service';
import { useForm } from 'react-hook-form';
import { Doctor } from '../doctor.model';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}



const CreateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { open, onClose, onRefresh } = props;
  const { register, handleSubmit, errors, watch } = useForm();

  const genderOptions = [
    { key: 'male', value: true, text: t('Male') },
    { key: 'female', value: false, text: t('Female') },
  ]

  const confirmPassword = useRef({});
  confirmPassword.current = watch("password", "");

  const [genderDoctor, setGenderDoctor] = useState(true);
  const onSubmit = async (data: Doctor) => {
    try {
      await doctorService.createDoctor({ ...data, gender: genderDoctor, userName: data.phone });
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Successful staff create')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed staff create')}
          type="failed"
        />,
      );
    }
  };

  return (
    <>
      <Modal open={open}>
        <Modal.Header>{t('Create new staff')}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group widths='equal'>
              <Form.Field>
                <label className="requiredLabel">{t('Code')}</label>
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
                <input name="fullName" ref={register(
                  {
                    required: { value: true, message: t('No staff name entered') },
                    minLength: { value: 4, message: t('Minimum 4 characters') },
                    maxLength: { value: 35, message: t('Maximum is 35 characters') }
                  }
                )} />
                {errors.fullName &&
                  <Label basic color='red' pointing>
                    {errors.fullName.message}
                  </Label>
                }
              </Form.Field>
            </Form.Group>


            <Form.Group widths='equal'>
              <Form.Field>
                <label className="requiredLabel">{t('Identity card')}</label>
                <input name="identityCard" ref={register(
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
                <input name="title" ref={register({
                  maxLength: { value: 30, message: t('Maximum 30 characters') }
                })} />
                {errors.title &&
                  <Label basic color='red' pointing>
                    {errors.title.message}
                  </Label>
                }
              </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Field>
                <label>{t('Academic Title')}</label>
                <input name="academicTitle" ref={register({
                  maxLength: { value: 30, message: t('Maximum 30 characters') }
                })} />
                {errors.academicTitle &&
                  <Label basic color='red' pointing>
                    {errors.academicTitle.message}
                  </Label>
                }
              </Form.Field>

              <Form.Field>
                <label className="requiredLabel">{t('Gender')}</label>
                <Select
                  // placeholder='Chọn giới tính'
                  options={genderOptions}
                  defaultValue={true}
                  onChange={(e: any, d: any) => setGenderDoctor(d.value)}
                />
              </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.Field>
                <label>{t('Email')}</label>
                <input name="email" ref={register(
                  {
                    // required: { value: true, message: 'Chưa nhập email' },
                    minLength: { value: 4, message: t('Minimum 4 characters') },
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


            </Form.Group>

            <Form.Group widths='equal'>

              <Form.Field>
                <label className="requiredLabel">{t('PhoneNumber')}</label>
                <input name="phone" ref={register(
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
                <label className="requiredLabel">{t('Password')}</label>
                <input type="password" name="password" ref={register(
                  {
                    maxLength: { value: 12, message: t('Maximum 12 characters') },
                    minLength: { value: 8, message: t('Minimum 8 characters') },
                    required: { value: true, message: t('Password not entered') },
                  }
                )} />
                {errors.password &&
                  <Label basic color='red' pointing>
                    {errors.password.message}
                  </Label>
                }
              </Form.Field>
              <Form.Field>
                <label className="requiredLabel">{t('Confirm password')}</label>
                <input type="password" name="confirmPassword" ref={register(
                  {
                    required: { value: true, message: t('Password not entered') },
                    validate: value => value === confirmPassword.current || `${t('Password incorrect')}`
                  }
                )} />
                {errors.confirmPassword &&
                  <Label basic color='red' pointing>
                    {errors.confirmPassword.message}
                  </Label>
                }
              </Form.Field>
            </Form.Group>

            <Form.Field >
              <Button primary type="submit" value="Save">{t('Submit')}</Button>
              <Button onClick={onClose} value="Save">{t('Cancel')}</Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
