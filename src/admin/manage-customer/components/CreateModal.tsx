/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../manage-customer/services';
import { Customer } from '../../manage-customer/models/customer';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@app/components/date-picker';
import { useAddress } from '@app/hooks';
import moment from 'moment';

interface Props {
  data: string;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const genderOptions = [
    { key: 'male', value: true, text: t('Male') },
    { key: 'female', value: false, text: t('Female') },
  ];

  const {
    province,
    district,
    setProvince,
    setDistrict,
    setWard,
    provinceOptions,
    districtOptions,
    wardOptions,
  } = useAddress();

  const { open, onClose, onRefresh } = props;
  const { register, handleSubmit, errors, setValue, unregister } = useForm();
  const [genderCustomer, setGenderCustomer] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const onSubmit = async (data: Customer) => {
    try {
      await customerService.createCustomer(
        {
          ...data,
          gender: genderCustomer,
          dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
        },
        props.data,
      );
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Successful customer create')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent content={t('Failed customer create')} type="failed" />,
      );
    }
  };

  useEffect(() => {
    register(
      { name: 'introduction' },
      {
        maxLength: { value: 250, message: t('Maximum 250 characters') },
      },
    );
    // setValue('introduction', userInfo?.introduction);
    register(
      { name: 'province' },
      {
        required: {
          value: true,
          message: t('No Province/City selected'),
        },
      },
    );
    // setValue('province', userInfo?.province);
    register(
      { name: 'district' },
      {
        required: {
          value: true,
          message: t('No District selected'),
        },
      },
    );
    // setValue('district', userInfo?.district);
    register(
      { name: 'ward' },
      {
        required: {
          value: true,
          message: t('No Ward selected'),
        },
      },
    );
    // setValue('ward', userInfo?.ward);
  }, [register, t]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        unregister('province');
        unregister('district');
        unregister('ward');
      }}
    >
      <Modal.Header>{t('Create new customer')}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label className="requiredLabel">{t('PhoneNumber')}</label>
            <input
              name="phoneNumber"
              ref={register({
                required: {
                  value: true,
                  message: t('Phone number not enterd'),
                },
                minLength: { value: 10, message: t('Minimum 10 numbers') },
                maxLength: { value: 11, message: t('Maximum 11 numbers') },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: t('Phone numbers contain digits from 0 -> 9'),
                },
              })}
            />
            {errors.phoneNumber && (
              <Label basic color="red" pointing>
                {errors.phoneNumber.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('Name')}</label>
            <input
              name="fullname"
              ref={register({
                required: {
                  value: true,
                  message: t('No customer name entered'),
                },
                minLength: { value: 4, message: t('Minimum 4 characters') },
                maxLength: {
                  value: 35,
                  message: t('Maximum is 35 characters'),
                },
              })}
            />
            {errors.fullname && (
              <Label basic color="red" pointing>
                {errors.fullname.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('Gender')}</label>
            <Select
              // placeholder='Chọn giới tính'
              options={genderOptions}
              defaultValue={true}
              onChange={(e: any, d: any) => setGenderCustomer(d.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>{t('Email')}</label>
            <input
              name="email"
              ref={register({
                // required: { value: true, message: t('Email is not enter') },
                minLength: { value: 8, message: t('Minimum 8 characters') },
                maxLength: { value: 120, message: t('Maximum 120 characters') },
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: t('Enter the wrong email format'),
                },
              })}
            />
            {errors.email && (
              <Label basic color="red" pointing>
                {errors.email.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Identity card')}</label>
            <input
              name="identityCard"
              ref={register({
                required: {
                  value: true,
                  message: t('No identity card entered'),
                },
                minLength: { value: 9, message: t('Minimum 8 characters') },
                maxLength: { value: 12, message: t('Maximum 12 characters') },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: t('Identity card contain digits from 0 -> 9'),
                },
              })}
            />
            {errors.identityCard && (
              <Label basic color="red" pointing>
                {errors.identityCard.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field
            label={t('Date of birth')}
            control={DatePicker}
            onChange={(value: Date) => setDateOfBirth(value)}
          />

          <Form.Field>
            <label className="requiredLabel">{t('Address')}</label>
            <input
              name="address"
              ref={register({
                required: { value: true, message: t('No address entered') },
                minLength: { value: 8, message: t('Minimum 8 characters') },
                maxLength: { value: 120, message: t('Maximum 120 characters') },
              })}
            />
            {errors.address && (
              <Label basic color="red" pointing>
                {errors.address.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Province/City')}</label>
            <Select
              name="province"
              fluid
              search
              deburr
              // value={province?.value}
              options={provinceOptions}
              onChange={(e, { name, value }): void => {
                setProvince(value as string);
                setValue(name, value);
              }}
            />
            {errors.province && (
              <Label basic color="red" pointing>
                {errors.province.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('District')}</label>
            <Select
              name="district"
              fluid
              search
              deburr
              // value={district?.value}
              options={districtOptions}
              onChange={(e, { name, value }): void => {
                setDistrict(province?.value as string, value as string);
                setValue(name, value);
              }}
            />
            {errors.district && (
              <Label basic color="red" pointing>
                {errors.district.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('Ward')}</label>
            <Select
              name="ward"
              fluid
              search
              deburr
              // value={ward?.value}
              options={wardOptions}
              onChange={(e, { name, value }): void => {
                setWard(
                  province?.value as string,
                  district?.value as string,
                  value as string,
                );
                setValue(name, value);
              }}
            />
            {errors.ward && (
              <Label basic color="red" pointing>
                {errors.ward.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <Button primary type="submit" value="Save">
              {t('Submit')}
            </Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default CreateModal;
