/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect, useCallback, PropsWithChildren } from 'react';

import moment from 'moment';

import { Form, DropdownItemProps, Checkbox } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField } from '@app/models/form-field';
import LocationSection from './LocationSection';
import { Location as ILocation } from './Location';

interface Props<T extends object> {
  formFields: FormField<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: T;
  loading?: boolean;
  confirmButtonLabel?: string;
  errors?: {
    [k: string]: string | string[];
  };
}

const SimpleForm: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const { formFields, onSubmit, defaultValues } = props;

  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    control,
    errors,
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
  });

  const { errors: propErrors } = props;
  useEffect(() => {
    if (propErrors) {
      clearErrors();
      Object.keys(propErrors).forEach((name) => {
        const fieldError = propErrors[name];
        const message = Array.isArray(fieldError)
          ? fieldError.join('; ')
          : fieldError;
        setError(name, { type: 'manual', message });
      });
    }
  }, [setError, clearErrors, propErrors]);

  // #region input
  type T = Parameters<typeof onSubmit>[0];
  type InputType = FormField<T>['inputType'];
  const input = useCallback(
    (
      name: keyof Partial<T>,
      label?: string,
      placeholder?: string,
      hidden?: boolean,
      inputType?: InputType,
      required?: boolean,
      pattern?: RegExp,
    ) => (
      <Controller
        key={`${name as string}`}
        control={control}
        name={`${name as string}`}
        defaultValue=""
        rules={{
          required,
          pattern: pattern
            ? { value: pattern, message: 'Chưa đúng định dạng' }
            : undefined,
        }}
        render={({ onChange, onBlur, value }): React.ReactElement => {
          let v = value as string;
          switch (inputType) {
            case 'month':
              v = moment(value).format('YYYY-MM');
              break;
            case 'date':
              v = moment(value).format('YYYY-MM-DD');
              break;
            case 'datetime-local':
              v = moment(value).format('YYYY-MM-DD HH:mm');
              break;
            default:
              break;
          }
          if (!hidden) {
            return (
              <Form.Input
                fluid
                type={inputType ?? 'text'}
                label={label}
                required={required}
                placeholder={placeholder}
                value={v}
                onChange={onChange}
                onBlur={onBlur}
                error={
                  Boolean(errors[`${name as string}`]) &&
                  (errors[`${name as string}`].message ||
                    t('Required').toString())
                }
              />
            );
          }
          return <></>;
        }}
      />
    ),
    [control, errors],
  );
  // #endregion

  // #region textarea
  const textarea = useCallback(
    (
      name: keyof Partial<T>,
      label?: string,
      placeholder?: string,
      required?: boolean,
    ) => (
      <div
        key={`${name as string}`}
        className={`field
          ${required ? 'required' : ''}
          ${errors[`${name as string}`] && 'error'}`}
      >
        <label htmlFor={`${name as string}`}>{label}</label>
        <textarea
          id={`${name as string}`}
          name={`${name as string}`}
          ref={register}
          placeholder={placeholder}
        />
        {errors[`${name as string}`] &&
          propErrors?.[`${name as string}`] !== '' && (
            <div className="ui pointing above prompt label">
              {propErrors?.[`${name as string}`]}
            </div>
          )}
      </div>
    ),
    [register, errors, propErrors],
  );
  // #endregion

  // #region select
  const select = useCallback(
    (
      name: keyof Partial<T>,
      options: DropdownItemProps[],
      label?: string,
      multiple?: boolean,
      hidden?: boolean,
      required?: boolean,
    ) => (
      <Controller
        key={`${name as string}`}
        control={control}
        name={`${name as string}`}
        defaultValue={null}
        rules={{ required }}
        render={({ onChange, onBlur, value }): React.ReactElement => {
          let multipleValue: string[] = [];
          if (multiple && value) {
            multipleValue = value as string[];
          }
          return (
            <div
              key={`${name as string}`}
              className={`field
                ${required ? 'required' : ''}
                ${hidden ? 'd-none' : ''}
                ${errors[`${name as string}`] && 'error'}`}
            >
              <label htmlFor={`${name as string}`}>{label}</label>
              <Form.Select
                fluid
                search
                deburr
                clearable
                required={required}
                multiple={multiple}
                options={options}
                value={
                  !value ? 0 : ((multiple ? multipleValue : value) as string)
                }
                onChange={(_, d): void => onChange(d.value)}
                onBlur={onBlur}
                error={
                  Boolean(errors[`${name as string}`]) &&
                  t('Required').toString()
                }
              />
            </div>
          );
        }}
      />
    ),
    [control, errors, propErrors],
  );
  // #endregion

  // #region location
  const location = useCallback(
    (name: keyof Partial<T>, locationData?: Location) => (
      <Controller
        key={`${name as string}`}
        control={control}
        name={`${name as string}`}
        defaultValue={null}
        render={({ onChange }): React.ReactElement => {
          return <LocationSection data={locationData} onChange={onChange} />;
        }}
      />
    ),
    [control],
  );
  // #endregion

  // #region checkbox
  const checkbox = useCallback(
    (name: keyof Partial<T>, label?: string, required?: boolean) => (
      <Controller
        key={`${name as string}`}
        control={control}
        name={`${name as string}`}
        defaultValue={null}
        render={({ onChange, value }): React.ReactElement => (
          <div
            key={`${name as string}`}
            className={`field
              ${required ? 'required' : ''}
              ${errors[`${name as string}`] && 'error'}`}
          >
            <Checkbox
              label={label}
              checked={Boolean(value) || false}
              onChange={(e, { checked }): void => onChange(checked)}
            />
            {errors[`${name as string}`] &&
              propErrors?.[`${name as string}`] !== '' && (
                <div className="ui pointing above prompt label">
                  {propErrors?.[`${name as string}`]}
                </div>
              )}
          </div>
        )}
      />
    ),
    [control, errors, propErrors],
  );
  // #endregion

  const { loading, confirmButtonLabel } = props;
  return (
    <Form loading={loading} onSubmit={handleSubmit((d) => onSubmit(d as T))}>
      {formFields.map((f) => {
        const renderField = () => {
          switch (f.type) {
            case 'location':
              return location(f.name, f?.locationData);
            case 'select':
              return select(
                f.name,
                f.options ?? [],
                f.label,
                f.multiple,
                f.hidden,
                f.required,
              );
            case 'checkbox':
              return checkbox(f.name, f.label, f.required);
            case 'textarea':
              return textarea(f.name, f.label, f.placeholder, f.required);
            case 'input':
            default:
              return input(
                f.name,
                f.label,
                f.placeholder,
                f.hidden,
                f.inputType,
                f.required,
                f.pattern,
              );
          }
        };
        return <Form.Group widths="equal">{renderField()}</Form.Group>;
      })}
      <Form.Button primary content={confirmButtonLabel ?? t('Confirm')} />
    </Form>
  );
};

export type Location = ILocation;
export default SimpleForm;
