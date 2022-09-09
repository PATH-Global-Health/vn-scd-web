/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Select, Form } from 'semantic-ui-react';

import { useAddress } from '@app/hooks';
import { useTranslation } from 'react-i18next';

import { Location } from './Location';

interface Props {
  data?: Location;
  onChange: (data: Location) => void;
}

const LocationSection: React.FC<Props> = (props) => {
  const { data, onChange } = props;
  const { t } = useTranslation();
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
  } = useAddress(data?.provinceCode, data?.districtCode, data?.wardCode);

  return (
    <>
      <Form.Field>
        <label>{t('Province/City')}</label>
        <Select
          fluid
          search
          deburr
          options={provinceOptions}
          value={province?.value}
          onChange={(e, d): void => {
            setProvince(d.value as string);
            onChange({
              provinceCode: d.value as string,
              districtCode: '',
              wardCode: '',
            });
          }}
        />
      </Form.Field>
      <Form.Field>
        <label>{t('District')}</label>
        <Select
          fluid
          search
          deburr
          options={districtOptions}
          value={district?.value}
          onChange={(e, d): void => {
            setDistrict(province?.value as string, d.value as string);
            onChange({
              provinceCode: province?.value as string,
              districtCode: d.value as string,
              wardCode: '',
            });
          }}
        />
      </Form.Field>
      <Form.Field>
        <label>{t('Ward')}</label>
        <Select
          fluid
          search
          deburr
          options={wardOptions}
          value={ward?.value}
          onChange={(e, d): void => {
            setWard(
              province?.value as string,
              district?.value as string,
              d.value as string,
            );
            onChange({
              provinceCode: province?.value as string,
              districtCode: district?.value as string,
              wardCode: d.value as string,
            });
          }}
        />
      </Form.Field>
    </>
  );
};

export default React.memo(LocationSection);
