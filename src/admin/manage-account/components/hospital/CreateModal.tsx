/* eslint-disable no-useless-escape */
import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Label,
  Modal,
  Select,
  TextArea,
} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useSelector, useAddress } from '@app/hooks';

import { hospitalService } from '../../services';
import { Hospital, HospitalCM } from '../../models/hospital';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface FormModel extends HospitalCM {
  location: Location;
}

interface Option {
  key: string;
  value: string;
  text: string;
}

const CreateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { open, onClose, onRefresh } = props;
  const { register, handleSubmit, errors, setValue, unregister } = useForm();
  const { unitTypeList } = useSelector((state) => state.admin.account.unitType);
  const unitTypeListOption = [] as Option[];
  unitTypeList.map((u) =>
    unitTypeListOption.push({ key: u.id, value: u.id, text: u.typeName }),
  );

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

  const onSubmit = async (data: Hospital) => {
    try {
      await hospitalService.createHospital(data);
      setValue('province', undefined);
      setValue('district', undefined);
      setValue('ward', undefined);
      setValue('unitTypeId', undefined);
      setValue('introduction', undefined);
      setProvince('');
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Create a successful sub facility')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Create a failed sub facility')}
          type="failed"
        />,
      );
    }
  };

  useEffect(() => {
    register(
      { name: 'unitTypeId' },
      {
        required: {
          value: true,
          message: t('No type selected'),
        },
      },
    );
    register(
      { name: 'introduction' },
      {
        // required: {
        //   value: true,
        //   message: 'Chưa nhập giới thiệu'
        // },
        maxLength: { value: 250, message: t('Maximum 250 characters') },
      },
    );
    register(
      { name: 'province' },
      {
        required: {
          value: true,
          message: t('No Province/City selected'),
        },
      },
    );
    register(
      { name: 'district' },
      {
        required: {
          value: true,
          message: t('No District selected'),
        },
      },
    );
    register(
      { name: 'ward' },
      {
        required: {
          value: true,
          message: t('No Ward selected'),
        },
      },
    );
  }, [open, register, t]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        unregister('unitTypeId');
        unregister('province');
        unregister('district');
        unregister('ward');
      }}
    >
      <Modal.Header>{t('Create new sub facility')}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label className="requiredLabel">{t('Type')}</label>
            <Select
              name="unitTypeId"
              options={unitTypeListOption}
              onChange={(e: any, { name, value }) => {
                setValue(name, value);
              }}
            />
            {errors.unitTypeId && (
              <Label basic color="red" pointing>
                {errors.unitTypeId.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('Name')}</label>
            <input
              name="name"
              ref={register({
                required: {
                  value: true,
                  message: t('No name entered sub facility'),
                },
                minLength: { value: 8, message: t('Minimum 8 characters') },
                maxLength: { value: 35, message: t('Maximum 35 characters') },
              })}
            />
            {errors.name && (
              <Label basic color="red" pointing>
                {errors.name.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('PhoneNumber')}</label>
            <input
              name="phone"
              ref={register({
                required: {
                  value: true,
                  message: t('No phone number entered'),
                },
                minLength: { value: 10, message: t('Minimum 10 numbers') },
                maxLength: { value: 11, message: t('Maximum 11 numbers') },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: t('Phone numbers contain digits from 0 -> 9'),
                },
              })}
            />
            {errors.phone && (
              <Label basic color="red" pointing>
                {errors.phone.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Email')}</label>
            <input
              name="email"
              ref={register({
                required: { value: true, message: t('Email is not enter') },
                minLength: { value: 4, message: t('Minimum 4 characters') },
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

          {/* <Form.Group inline>
            <label>Chức năng</label>
            <Form.Field>
              <Checkbox onChange={(e: any, data: any) => data.checked ? setIsTestingFacility(true) : setIsTestingFacility(false)} label='Cơ sở xét nghiệm' />
            </Form.Field>

            <Form.Field>
              <Checkbox onChange={(e: any, data: any) => data.checked ? setIsPrEPFacility(true) : setIsPrEPFacility(false)} label='Cơ sở điều trị PrEP' />
            </Form.Field>

            <Form.Field>
              <Checkbox onChange={(e: any, data: any) => data.checked ? setIsARTFacility(true) : setIsARTFacility(false)} label='Cơ sở điều trị ARV' />
            </Form.Field>
          </Form.Group> */}

          <Form.Field>
            <label>{t('Website')}</label>
            <input
              name="website"
              ref={register({
                // required: { value: true, message: 'Chưa nhập website' },
                minLength: { value: 4, message: t('Minimum 4 characters') },
                maxLength: { value: 120, message: t('Maximum 120 characters') },
              })}
            />
            {errors.website && (
              <Label basic color="red" pointing>
                {errors.website.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label>{t('Introduction')}</label>
            <TextArea
              name="introduction"
              onChange={(e, { name, value }) => {
                setValue(name, value);
              }}
            />
            {errors.introduction && (
              <Label basic color="red" pointing>
                {errors.introduction.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Address')}</label>
            <input
              name="address"
              ref={register({
                required: { value: true, message: t('No address entered') },
                maxLength: { value: 250, message: t('Maximum 250 characters') },
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
