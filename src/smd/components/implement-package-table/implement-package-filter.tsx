import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import locations from '@app/assets/mock/locations.json';
import { useDispatch, useSelector } from '@app/hooks';
import { getPackages } from '@smd/redux/smd-package';

const Wrapper = styled(Grid)`
  margin: 0 !important;
  background: white;

  & > div.row {
    padding: 2px 0 !important;
  }
  & > div.row:first-child {
    padding-bottom: 2px !important;
  }
  & > div.row:last-child {
    padding-top: 2px !important;
  }
  & div.row,
  & div.column {
    font-weight: 600;
  }
  & > div.row > div.column {
    padding: 4px !important;
  }
  & > div.row > div.column:first-child {
    padding-left: 0 !important;
  }
  & > div.row > div.column:last-child {
    padding-right: 0 !important;
  }
  & > div.row:first-child {
    padding-bottom: 0;
  }
  & > div.row:last-child {
    padding-top: 0;
  }
`;

const StyledButton = styled(Form.Button)`
  margin-top: 4px !important;
  margin-bottom: 20px !important;
  padding-left: 0 !important;
  padding-right: 4px !important;
`;

interface Props {
  onChange: (data: { packageId: string; province: string }) => void;
}

const ImplementPackageFilterFilter: React.FC<Props> = ({ onChange }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data } = useSelector(
    (s) => s.smd.smdPackage.sMDPackageData,
  );

  const [province, setProvince] = useState<string>('');
  const [packageId, setPackageId] = useState<string>('');

  const onSearch = useCallback(() => {
    onChange({
      province,
      packageId
    });
  }, [onChange, province, packageId]);

  const onReset = () => {
    setProvince('');
    setPackageId('');
    onChange({
      province,
      packageId
    });
  };

  return (
    <Wrapper>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Select
            fluid
            search
            deburr
            clearable
            value={packageId || ''}
            label={t('Filter by package').toString()}
            options={data.map((p) => ({
              text: p.name,
              value: p.id,
            }))}
            onChange={(_, { value: v }): void => {
              setPackageId(v as string);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search
            deburr
            clearable
            value={province || ''}
            label={t('PSNUs').toString()}
            options={locations.map((p) => ({
              text: p.label,
              value: p.value,
            }))}
            onChange={(_, { value: v }): void => {
              setProvince(v as string);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <StyledButton
        primary
        labelPosition="right"
        icon="sync"
        content={t('Reset').toString()}
        onClick={onReset}
      />
      <StyledButton
        color="twitter"
        labelPosition="right"
        icon="filter"
        content={t('Apply').toString()}
        onClick={onSearch}
      />
    </Wrapper>
  );
};

export default ImplementPackageFilterFilter;
