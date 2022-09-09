import React, { useState, useEffect } from 'react';
import { Checkbox, Grid, Button, Form, Label } from 'semantic-ui-react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import styled from 'styled-components';

import { v4 as uuidv4 } from 'uuid';

import DataList from '@app/components/data-list';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const AddWeekDayWrapper = styled.div`
  padding-right: 18px;
`;



export interface ScheduleWeekDays {
  Id: string;
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
  FromHour: string;
  ToHour: string;
}



interface Props {
  onChange: (data: ScheduleWeekDays[]) => void;
}

const DaysInWeekList: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const { onChange } = props;

  const weekDayMap = {
    Mon: t('Mon'),
    Tue: t('Tue'),
    Wed: t('Wed'),
    Thu: t('Thu'),
    Fri: t('Fri'),
    Sat: t('Sat'),
    Sun: t('Sun'),
  };
  type WeekDayMap = typeof weekDayMap;

  const getHeader = (data: ScheduleWeekDays): string => {
    const days: string[] = [];
  
    Object.keys(data).forEach((field) => {
      if (data[field as keyof ScheduleWeekDays] === true) {
        const dayLabel = weekDayMap[field as keyof WeekDayMap]; // lmao boi
        days.push(dayLabel);
      }
    });
  
    return days.join(' | ');
  };

  const [adding, setAdding] = useState<ScheduleWeekDays>();
  const [data, setData] = useState<ScheduleWeekDays[]>([]);
  useEffect(() => {
    onChange(
      data.map((d) => {
        const tmp = { ...d };
        delete tmp.Id;
        return tmp;
      }),
    );
  }, [onChange, data]);

  return (
    <>
      <DataList
        title={t('Working day of week')}
        data={data}
        getRowKey={(r): string => r.Id}
        itemHeaderRender={(r): string => getHeader(r)}
        itemContentRender={(r): string => `${r.FromHour} -> ${r.ToHour}`}
        listActions={[
          {
            color: 'green',
            icon: <FiPlus />,
            title: t('Add'),
            onClick: (): void => {
              setAdding({
                Id: uuidv4(),
                FromHour: '',
                ToHour: '',
                Mon: false,
                Tue: false,
                Wed: false,
                Thu: false,
                Fri: false,
                Sat: false,
                Sun: false,
              });
            },
          },
        ]}
        itemActions={[
          {
            color: 'red',
            icon: <FiTrash2 />,
            title: t('Delete'),
            onClick: (r): void => {
              setData((d) => d.filter((e) => e.Id !== r.Id));
            },
          },
        ]}
      />

      {data.length === 0 && !adding && (
        <Label basic color="violet" pointing>
          {t('Please select working day of week')}
        </Label>
      )}

      {adding && (
        <AddWeekDayWrapper>
          <Grid padded>
            <Grid.Row>
              <Grid.Column textAlign="left" width={4}>
                {Object.keys(weekDayMap).map((d) => (
                  <Checkbox
                    key={d}
                    label={weekDayMap[d as keyof WeekDayMap]}
                    checked={adding[d as keyof ScheduleWeekDays] as boolean}
                    onChange={(e, { checked }): void => {
                      setAdding({
                        ...adding,
                        [d as keyof ScheduleWeekDays]: checked,
                      });
                    }}
                  />
                ))}
              </Grid.Column>
              <Grid.Column width={12}>
                <Form.Input
                  label={t('Start time')}
                  type="time"
                  onChange={(e, { value }): void => {
                    setAdding({ ...adding, FromHour: value });
                  }}
                />
                <Form.Input
                  label={t('End time')}
                  type="time"
                  onChange={(e, { value }): void => {
                    setAdding({ ...adding, ToHour: value });
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Button
              primary
              content={t('Add')}
              onClick={(): void => {
                setData((d) => [...d, adding]);
                setAdding(undefined);
              }}
              disabled={
                !Object.values(adding).some((day) => day === true) ||
                adding.FromHour === '' ||
                adding.ToHour === '' ||
                moment('2021-08-11 ' + adding.FromHour).format('YYYY-MM-DD HH:mm:ss') >= moment('2021-08-11 ' + adding.ToHour).format('YYYY-MM-DD HH:mm:ss')
              }
            />
            <Button content={t('Cancel')} onClick={(): void => setAdding(undefined)} />
          </Grid>
        </AddWeekDayWrapper>
      )}
    </>
  );
};

export default DaysInWeekList;
