/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useEffect, useCallback } from 'react';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';

import moment from 'moment';
import { useSelector } from '@app/hooks';

// const locale = 'vi';
const dateFormat = 'DD-MM-YYYY';

// prettier-ignore
// const months = [
//   'Tháng 1', 'Tháng 2', 'Tháng 3',
//   'Tháng 4', 'Tháng 5', 'Tháng 6',
//   'Tháng 7', 'Tháng 8', 'Tháng 9',
//   'Tháng 10', 'Tháng 11', 'Tháng 12',
// ];

interface Props {
  value?: Date;
  placeholder?: string;
  readOnly?: boolean;
  disabledDays?: Date[];
  onChange: (date: Date) => void;
  onError?: (err: string) => void;
}

const DatePicker: React.FC<Props> = (props) => {
  const { language } = useSelector((state) => state.auth);
  const [value, setValue] = useState<Date>();
  const [inputValue, setInputValue] = useState('');
  const { value: propValue } = props;
  useEffect(() => {
    if (propValue) {
      setValue(propValue);
      setInputValue(moment(propValue).format(dateFormat));
    } else {
      setValue(undefined);
      setInputValue('');
    }
  }, [propValue]);

  const onKeyUp = useCallback((e: React.KeyboardEvent): void => {
    const target = e?.target as HTMLInputElement;
    const { value: eValue } = target;
    if (eValue === '') {
      setValue(undefined);
    }

    const d = eValue.replace(/\D/g, '').slice(0, 10);
    if (d.length >= 4) {
      const result = `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
      setInputValue(result);
    } else if (d.length >= 2) {
      const result = `${d.slice(0, 2)}-${d.slice(2)}`;
      setInputValue(result);
    } else {
      setInputValue(d);
    }
  }, []);

  const {
    placeholder,
    readOnly = false,
    disabledDays,
    onChange,
    onError,
  } = props;
  return (
    <div className="ui form">
      <DayPickerInput
        value={inputValue || value}
        format={dateFormat}
        parseDate={MomentLocaleUtils.parseDate}
        formatDate={MomentLocaleUtils.formatDate}
        placeholder={placeholder ?? dateFormat}
        onDayChange={(d) => {
          if (d === undefined) {
            onError?.('InvalidDate');
          } else {
            onChange(d);
            setValue(d);
          }
        }}
        inputProps={{ readOnly, onKeyUp, maxLength: 10 }}
        dayPickerProps={{
          // months,
          locale: language,
          disabledDays,
          localeUtils: MomentLocaleUtils,
          className: readOnly ? 'd-none' : '',
        }}
      />
    </div>
  );
};

export default React.memo(DatePicker);
