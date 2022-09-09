/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react';
import { Form, Header } from 'semantic-ui-react';
import { Controller, useForm } from 'react-hook-form';

import nations from '@app/assets/mock/nations.json';
import { ExitInformation } from '@csyt/examination/examination.model';

interface Props {
  loading: boolean;
  onChange: (d: ExitInformation) => void;
}

const CustomerExitSection: React.FC<Props> = ({
  loading,
  onChange: onChangeProps,
}) => {
  const { control, getValues } = useForm<ExitInformation>();
  const triggerOnChange = () => {
    const { destination, exitingDate, entryingDate } = getValues();
    onChangeProps({
      destination,
      exitingDate,
      entryingDate,
    });
  };
  return (
    <Form loading={loading}>
      <Header content="Thông tin xuất cảnh" />
      <Form.Group widths="equal">
        <Controller
          name="exitingDate"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              required
              label="Ngày/giờ xuất cảnh"
              type="datetime-local"
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="entryingDate"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              required
              label="Ngày/giờ nhập cảnh"
              type="datetime-local"
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="destination"
          defaultValue="Việt Nam"
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              label="Nước đến"
              value={value as string}
              onChange={(e, { value: v }) => onChange(v)}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={nations.map((n) => ({
                text: n.name,
                value: n.name,
              }))}
            />
          )}
        />
      </Form.Group>
    </Form>
  );
};

export default CustomerExitSection;
