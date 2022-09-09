/*eslint-disable-next-line*/
import React, { useState, useEffect, useMemo } from 'react';
import { Dimmer, Loader, Grid, Button } from 'semantic-ui-react';
import { FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';

import moment from 'moment';
import { DatePicker, WeekPicker } from '@app/components/date-picker';
import SearchBar from '@app/components/SearchBar';

import { deburr } from '@app/utils/helpers';

import WeekSchedule from './WeekSchedule';
import StatusFilter from './StatusFilter';
import DaySchedule from './DaySchedule';

import { WeekDay, WeekDayLabel } from './week-day';
import { StatusMap as IStatusMap } from './status-map';
import { Agenda as IAgenda } from './agenda';
import { useTranslation } from 'react-i18next';
// import { useSelector } from '@app/hooks';

const Container = styled.div`
  position: relative;
  padding: 6px;
  background: #ffffff;
  .toolbar {
    margin-top: 6px;
    margin-bottom: 6px;
  }
  .ui.grid > .row {
    padding: 0;
  }
  .ui.table td {
    padding: 6px !important;
  }
  .ui.table thead th {
    padding-bottom: 0;
  }
  .ui.loader {
    position: absolute !important;
    top: 250px !important;
  }
`;
const FlexDiv = styled.div`
  display: flex;
  .dp {
    width: 140px;
    margin-right: 10px;
  }
  svg {
    vertical-align: bottom;
    margin-right: 8px !important;
  }
`;



interface Props {
  loading?: boolean;
  agendaList: IAgenda[];
  statusMap?: IStatusMap;
  weekStartDate?: Date;
  onWeekChange?: (from: Date, to: Date) => void;
  onAgendaClick?: (id: IAgenda['id']) => void;
}

const defaultWeekStartDate = moment().startOf('isoWeek').toDate();
const ScheduleCalendar: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  // const language = useSelector(state => state.auth.language);

  const getWeekDayLabel = (i: number): WeekDayLabel => {
    switch (i) {
      case 1:
        return t('Monday');
      case 2:
        return t('Tuesday');
      case 3:
        return t('Wednesday');
      case 4:
        return t('Thursday');
      case 5:
        return t('Friday');
      case 6:
        return t('Saturday');
      case 0:
      default:
        return t('Sunday');
    }
  };

  const calculateWeekDays = (startDate: Date): WeekDay[] => {
  
    const result: WeekDay[] = [];
    const weekStartDate = moment(startDate).startOf('isoWeek').toDate();
    
  
    for (let i = 2; i <= 8; i += 1) {
      const date = moment(weekStartDate).add(i - 2, 'days');
      const day: WeekDay = {
        dayOfWeekLabel: getWeekDayLabel(date.get('day')),
        dayOfMonth: date.format('DD'),
        fullDate: date.toDate(),
      };
  
      result.push(day);
    }
  
    return result;
  };
  const {
    loading,
    agendaList,
    statusMap,
    onWeekChange,
    onAgendaClick,
    weekStartDate: weekStartDateProp,
  } = props;

  const [weekStartDate, setWeekStartDate] = useState(
    weekStartDateProp ?? defaultWeekStartDate,
  );
  useEffect(() => {
    if (weekStartDateProp) {
      setWeekStartDate(weekStartDateProp);
    }
  }, [weekStartDateProp]);
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);

  useEffect(() => {
    setWeekDays(calculateWeekDays(weekStartDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStartDate, t]);

  const [statusFilterList, setStatusFilterList] = useState<number[]>([]);
  const filterList = useMemo(
    () => <StatusFilter statusMap={statusMap} onChange={setStatusFilterList} />,
    [statusMap],
  );

  const [searchValue, setSearchValue] = useState('');
  const [filteredAgendaList, setFilteredAgendaList] = useState(agendaList);
  useEffect(() => {
    setFilteredAgendaList(
      agendaList.filter((a) => {
        const includeSearchValue = a.infoList.some((info) =>
          deburr(info.content).includes(deburr(searchValue)),
        );
        const includeStatusFilter =
          statusFilterList.length === 0 || statusFilterList.includes(a.status);

        return includeSearchValue && includeStatusFilter;
      }),
    );
  }, [agendaList, searchValue, statusFilterList]);

  const [selectedDay, setSelectedDay] = useState<Date>();

  return (
    <Container>
      <Dimmer inverted active={loading}>
        <Loader active />
      </Dimmer>
      <SearchBar onChange={(s) => setSearchValue(s)} size="small" />
      <Grid className="toolbar">
        <Grid.Row>
          <Grid.Column width={6}>
            {!selectedDay && (
              <WeekPicker
                weekStartDate={weekStartDate}
                onChange={({ from, to }) => {
                  setWeekStartDate(from);
                  onWeekChange?.(from, to);
                }}
              />
            )}
            {selectedDay && (
              <FlexDiv>
                <div className="dp">
                  <DatePicker
                    value={selectedDay}
                    onChange={(d) => setSelectedDay(d)}
                  />
                </div>
                <Button
                  content={t('Week schedule')}
                  icon={<FiArrowLeft />}
                  onClick={() => setSelectedDay(undefined)}
                />
              </FlexDiv>
            )}
          </Grid.Column>
          <Grid.Column width={10} textAlign="right">
            {filterList}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {!selectedDay && (
        <WeekSchedule
          weekDays={weekDays}
          data={filteredAgendaList}
          statusMap={statusMap}
          onAgendaClick={onAgendaClick}
          onDayHeaderClick={(d) => setSelectedDay(d.fullDate)}
        />
      )}
      {selectedDay && (
        <DaySchedule
          date={selectedDay}
          data={filteredAgendaList}
          statusMap={statusMap}
          onAgendaClick={onAgendaClick}
        />
      )}
    </Container>
  );
};

export default ScheduleCalendar;
export type StatusMap = IStatusMap;
export type Agenda = IAgenda;
