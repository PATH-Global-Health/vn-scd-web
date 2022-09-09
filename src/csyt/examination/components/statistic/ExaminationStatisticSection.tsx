import React, { useCallback, useEffect, useMemo, useState } from 'react';

import moment from 'moment';
import styled from 'styled-components';

import { Dimmer, Grid, Header, Loader } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useRefreshCallback, useSelector } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { getExaminationStatistic } from '@csyt/examination/examination.slice';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import StatusFilter from '@app/components/schedule-calendar/StatusFilter';
import ExaminationBarChart from './ExaminationBarChart';
import ExaminationPieChart from './ExaminationPieChart';

const StyledGrid = styled(Grid)`
  height: 100%;
`;

interface StatusOptions {
  key: string;
  color: string;
  label: string;
  hex: string;
}

const ExaminationStatisticSection: React.FC = () => {
  const { t } = useTranslation();

  const initialStatus: StatusOptions = {
    key: '',
    color: '',
    label: '',
    hex: '',
  };

  const getStatusColor = useCallback(
    (label: string): StatusOptions => {
      const options = [
        {
          key: 'UNFINISHED',
          color: 'blue',
          label: t('Not examination'),
          hex: '#2185d0',
        },
        { key: 'FINISHED', color: 'green', label: t('Done'), hex: '#21ba45' },
        {
          key: 'CANCELED_BY_CUSTOMER',
          color: 'grey',
          label: t('Cancel by customer'),
          hex: '#767676',
        },
        {
          key: 'NOT_DOING',
          color: 'brown',
          label: t('No work'),
          hex: '#a5673f',
        },
        { key: 'CANCELED', color: 'red', label: t('Cancel'), hex: '#db2828' },
        {
          key: 'TRANSFERRED',
          color: 'violet',
          label: t('Transfer'),
          hex: '#6435c9',
        },
        {
          key: 'RESULTED',
          color: 'green',
          label: t('Have result'),
          hex: '#21ba45',
        },
      ];
      return options.find((o) => o.key === label) || initialStatus;
    },
    [initialStatus, t],
  );

  const dispatch = useDispatch();

  const selectedHospital = useSelector(
    (s) => s.csyt.examination.selectedHospital,
  );
  const statisticData = useSelector((s) => s.csyt.examination.statisticData);
  const getStatisticLoading = useSelector(
    (s) => s.csyt.examination.getStatisticLoading,
  );
  const statusMap = useSelector((s) => s.csyt.examination.statusMap);

  const [from, setFrom] = useState<Date>(
    moment().startOf('isoWeek').subtract(7, 'days').toDate(),
  );
  const [to, setTo] = useState<Date>(moment().startOf('isoWeek').toDate());

  const getData = useCallback(() => {
    if (selectedHospital && from && to) {
      dispatch(
        getExaminationStatistic({ from, to, unitId: selectedHospital.id }),
      );
    }
  }, [dispatch, selectedHospital, from, to]);
  useRefreshCallback(
    GroupKey.CSYT_EXAMINATION,
    GroupKey.CSYT_EXAMINATION,
    getData,
  );
  useEffect(getData, [getData]);

  const data = useMemo(() => {
    return Object.entries(statisticData || {})
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => ({
        key: key.toUpperCase(),
        label: getStatusColor(key.toUpperCase())?.label ?? '',
        value: value as string,
      }));
  }, [getStatusColor, statisticData]);

  const modifiers = { start: from, end: to };
  const handleDayClick = (day: Date) => {
    const { from: fromRange, to: toRange } = DateUtils.addDayToRange(day, {
      from,
      to,
    });
    setFrom(fromRange);
    setTo(toRange);
  };

  const filterList = useMemo(() => <StatusFilter statusMap={statusMap} />, [
    statusMap,
  ]);

  return (
    <StyledGrid>
      <Grid.Row centered>
        <DayPicker
          className="range-picker"
          month={
            new Date(
              parseInt(moment().format('YYYY'), 10),
              parseInt(moment().format('MM'), 10) - 3,
            )
          }
          numberOfMonths={3}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={handleDayClick}
        />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={6} textAlign="right">
          <Header>
            {`${t('Sum')}:`}
            {statisticData?.total}
          </Header>
        </Grid.Column>
        <Grid.Column width={10}>{filterList}</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
          <Dimmer active={getStatisticLoading} inverted>
            <Loader />
          </Dimmer>
          <ExaminationBarChart data={data} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Dimmer active={getStatisticLoading} inverted>
            <Loader />
          </Dimmer>
          <ExaminationPieChart data={data} />
        </Grid.Column>
      </Grid.Row>
    </StyledGrid>
  );
};

export default ExaminationStatisticSection;
