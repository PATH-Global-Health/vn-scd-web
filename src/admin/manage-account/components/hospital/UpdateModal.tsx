import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Dimmer,
  Form,
  Label,
  Loader,
  Modal,
  Select,
  TextArea,
} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useSelector, useAddress } from '@app/hooks';
import { Location } from '@app/components/simple-form';
import { hospitalService } from '../../services';
import { Hospital } from '../../models/hospital';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getHospitals } from '@admin/manage-account/slices/hospital';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: Hospital;
  onRefresh: () => void;
}

interface FormModel extends Hospital {
  location?: Location;
}

interface Option {
  key: string;
  value: string;
  text: string;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  /* eslint-disable no-useless-escape */
  const dispatch = useDispatch();
  const { onClose, data, onRefresh, open } = props;
  const { register, handleSubmit, errors, setValue, unregister } = useForm();
  const { unitTypeList } = useSelector((state) => state.admin.account.unitType);
  const { getHospitalsLoading } = useSelector(
    (state) => state.admin.account.hospital,
  );
  const unitTypeListOption = [] as Option[];
  unitTypeList.map((u) =>
    unitTypeListOption.push({ key: u.id, value: u.id, text: u.typeName }),
  );
  setValue('unitTypeId', data?.unitTypeId);

  const {
    province,
    district,
    ward,
    setProvince,
    setDistrict,
    setWard,
    provinceOptions,
    districtOptions,
    wardOptions,
  } = useAddress(data?.province, data?.district, data?.ward);

  const onSubmit = async (data: Hospital) => {
    try {
      await hospitalService.updateHospital(data);
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content={t('Update successful sub facility')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Update failed sub facility')}
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
    setValue('unitTypeId', data?.unitTypeId);
    register(
      { name: 'introduction' },
      {
        // required: {
        //   value: true,
        //   message: 'Chưa nhập giới thiệu'
        // },
        maxLength: { value: 250, message: t('Enter up to 250 characters') },
      },
    );
    setValue('introduction', data?.introduction);
    register(
      { name: 'province' },
      {
        required: {
          value: true,
          message: t('No Province/City selected'),
        },
      },
    );
    setValue('province', data?.province);
    register(
      { name: 'district' },
      {
        required: {
          value: true,
          message: t('No District selected'),
        },
      },
    );
    setValue('district', data?.district);
    register(
      { name: 'ward' },
      {
        required: {
          value: true,
          message: t('No Ward selected'),
        },
      },
    );
    setValue('ward', data?.ward);
  }, [open, data, register, setValue, t]);

  return (
    <Modal
      open={open && Boolean(data)}
      onClose={() => {
        onClose();
        unregister('unitTypeId');
        unregister('province');
        unregister('district');
        unregister('ward');
      }}
    >
      <Modal.Header>{t('Update sub facility')}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="id"
            hidden
            defaultValue={data?.id}
            ref={register}
          ></input>
          <input
            name="username"
            hidden
            defaultValue={data?.username}
            ref={register}
          ></input>
          <Form.Field>
            <label className="requiredLabel">{t('Type')}</label>
            <Select
              name="unitTypeId"
              defaultValue={data?.unitTypeId}
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
              defaultValue={data?.name}
              name="name"
              ref={register({
                required: {
                  value: true,
                  message: t('No name entered sub facility'),
                },
                minLength: { value: 8, message: t('Minimum 8 characters') },
                maxLength: { value: 35, message: t('Up to 35 characters') },
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
              defaultValue={data?.phone}
              name="phone"
              ref={register({
                required: {
                  value: true,
                  message: t('No phone number entered'),
                },
                minLength: { value: 10, message: t('Minimum 10 numbers') },
                maxLength: { value: 11, message: t('Up to 11 numbers') },
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
              defaultValue={data?.email}
              name="email"
              ref={register({
                required: { value: true, message: t('Email is not enter') },
                minLength: { value: 4, message: t('Minimum 4 characters') },
                maxLength: { value: 120, message: t('Up to 120 characters') },
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

          <Form.Group inline>
            <label>{t('Function')}</label>
            <Form.Field>
              <Checkbox
                defaultChecked={data?.isTestingFacility}
                onChange={async (e: any, data: any) => {
                  if (data.checked) {
                    await hospitalService.setTestingFacility(
                      props.data?.id!,
                      true,
                    );
                    dispatch(getHospitals());
                  } else {
                    await hospitalService.setTestingFacility(
                      props.data?.id!,
                      false,
                    );
                    dispatch(getHospitals());
                  }
                }}
                label={t('Testing Facility')}
              />
            </Form.Field>

            <Form.Field>
              <Checkbox
                defaultChecked={data?.isPrEPFacility}
                onChange={async (e: any, data: any) => {
                  if (data.checked) {
                    await hospitalService.setPrEPFacility(
                      props.data?.id!,
                      true,
                    );
                    dispatch(getHospitals());
                  } else {
                    await hospitalService.setPrEPFacility(
                      props.data?.id!,
                      false,
                    );
                    dispatch(getHospitals());
                  }
                }}
                label={t('PrEP Facility')}
              />
            </Form.Field>

            <Form.Field>
              <Checkbox
                defaultChecked={data?.isARTFacility}
                onChange={async (e: any, data: any) => {
                  if (data.checked) {
                    await hospitalService.setARVFacility(props.data?.id!, true);
                    dispatch(getHospitals());
                  } else {
                    await hospitalService.setARVFacility(
                      props.data?.id!,
                      false,
                    );
                    dispatch(getHospitals());
                  }
                }}
                label={t('ARV Facility')}
              />
            </Form.Field>
          </Form.Group>

          {getHospitalsLoading && (
            <Dimmer active inverted>
              <Loader size="mini">Loading</Loader>
            </Dimmer>
          )}

          <Form.Field>
            <label>{t('Website')}</label>
            <input
              defaultValue={data?.website}
              name="website"
              ref={register({
                // required: { value: true, message: 'Chưa nhập website' },
                minLength: { value: 4, message: t('Minimum 4 characters') },
                maxLength: { value: 120, message: t('Up to 120 characters') },
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
            >
              {data?.introduction}
            </TextArea>
            {errors.introduction && (
              <Label basic color="red" pointing>
                {errors.introduction.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Address')}</label>
            <input
              defaultValue={data?.address}
              name="address"
              ref={register({
                required: { value: true, message: t('No address entered') },
                maxLength: { value: 250, message: t('Up to 250 characters') },
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
              value={province?.value}
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
              value={district?.value}
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
              value={ward?.value}
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

export default UpdateModal;
