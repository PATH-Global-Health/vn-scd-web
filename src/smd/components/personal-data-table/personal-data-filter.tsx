import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Form, Grid } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';

import locations from '@app/assets/mock/locations.json';
import { DatePicker } from '@app/components/date-picker';

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
  onChange: (data: object) => void;
}
const PersonalDataFilter: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();

  const [testResult, setTestResult] = useState<string>();
  const [referralServices, setReferralServices] = useState<string[]>();
  const [psnUs, setPsnUs] = useState<string[]>();
  const [dateUpdatedFrom, setDateUpdatedFrom] = useState<Date>();
  const [dateUpdatedTo, setDateUpdatedTo] = useState<Date>();

  const [from, setFrom] = useState<Date>(
    moment().subtract(1, 'month').startOf('month').toDate(),
  );
  const [to, setTo] = useState<Date>(moment().endOf('month').toDate());

  const onSearch = useCallback(() => {
    const dateTimes: string[] = [];
    const mf = moment(from);
    const mt = moment(to);
    while (mt > mf || mf.format('M') === mt.format('M')) {
      dateTimes.push(mf.format('YYYY-MM-01'));
      mf.add(1, 'month');
    }
    onChange({
      referralServices,
      psnUs,
      dateTimes,
      testResult,
      dateUpdatedFrom,
      dateUpdatedTo,
    });
  }, [
    onChange,
    from,
    to,
    referralServices,
    psnUs,
    testResult,
    dateUpdatedFrom,
    dateUpdatedTo,
  ]);

  const onReset = () => {
    setTestResult(undefined);
    setReferralServices(undefined);
    setPsnUs(undefined);
    setDateUpdatedFrom(undefined);
    setDateUpdatedTo(undefined);
    setFrom(moment().subtract(1, 'month').startOf('month').toDate());
    setTo(moment().endOf('month').toDate());
  };

  return (
    <Wrapper>
      <Grid.Row columns={3}>
        <Grid.Column>
          <Form.Select
            fluid
            search
            deburr
            clearable
            multiple
            value={referralServices || []}
            label={t('Referral Services').toString()}
            options={['ARV', 'PrEP'].map((e) => ({ value: e, text: e }))}
            onChange={(_, { value: v }): void => {
              setReferralServices(v as string[]);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search
            deburr
            clearable
            value={testResult || ''}
            label={t('Test result').toString()}
            options={[
              { text: t('Positive'), value: 'POSITIVE' },
              { text: t('Negative'), value: 'NEGATIVE' },
            ]}
            onChange={(_, { value: v }): void => {
              setTestResult(v as string);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search
            deburr
            multiple
            clearable
            value={psnUs || []}
            label={t('PSNUs').toString()}
            options={locations.map((e) => ({ text: e.label, value: e.value }))}
            onChange={(_, { value: v }): void => {
              setPsnUs(v as string[]);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Field
            fluid
            control={DatePicker}
            value={from}
            label={t('From date').toString()}
            onChange={(value: Date) => setFrom(value)}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid
            value={to}
            control={DatePicker}
            label={t('To date').toString()}
            disabledDays={(d: Date) => {
              return (
                moment(from).format('YYYY-MM-DD') >
                moment(d).format('YYYY-MM-DD')
              );
            }}
            onChange={(value: Date) => setTo(value)}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Field
            fluid
            control={DatePicker}
            value={dateUpdatedFrom}
            label={t('From updated date').toString()}
            onChange={(value: Date) => setDateUpdatedFrom(value)}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid
            control={DatePicker}
            value={dateUpdatedTo}
            label={t('To updated date').toString()}
            disabledDays={(d: Date) => {
              return (
                moment(dateUpdatedFrom).format('YYYY-MM-DD') >
                moment(d).format('YYYY-MM-DD')
              );
            }}
            onChange={(value: Date) => setDateUpdatedTo(value)}
          />
        </Grid.Column>
      </Grid.Row>
      <StyledButton
        primary
        labelPosition="right"
        icon="sync"
        content="Reset"
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

export default PersonalDataFilter;
