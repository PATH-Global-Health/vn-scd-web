import React, { useEffect, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbSectionProps,
  Message,
  Loader,
} from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { getInjectionObjects } from '@csyt/examination/examination.slice';

import WorkingCalendarTable from './components/WorkingCalendarTable';
import WorkingCalendarDayTable from './components/WorkingCalendarDayTable';
import WorkingCalendarIntervalTable from './components/WorkingCalendarIntervalTable';
import {
  selectHospital,
  selectWorkingCalendar,
  selectWorkingCalendarDay,
} from './working-schedule.slice';
import { getDoctors } from '../catalog/doctor/doctor.slice';
import WorkingCalendarHospitalTable from './components/WorkingCalendarHospitalTable';
import { useTranslation } from 'react-i18next';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const MessageContent = styled.div`
  display: flex;
`;
const MessageLeftContent = styled.div`
  position: relative;
  margin-left: 6px;
  margin-right: 26px;
  & svg {
    font-size: 34px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const WorkingSchedulePage: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedHospital,
    selectedWorkingCalendar,
    selectedWorkingCalendarDay,
    scheduleCreatingList,
  } = useSelector((state) => state.csyt.workingSchedule);
  

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectHospital(undefined));
    dispatch(getDoctors());
    dispatch(getInjectionObjects());
  }, [dispatch]);

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selectedHospital ? t('Sub facility') : selectedHospital.name,
        active: !selectedHospital,
        onClick: (): void => {
          dispatch(selectHospital(undefined));
        },
      },
    ];

    if (selectedHospital) {
      bc.push({
        key: 1,
        content: t('Working Schedule'),
        active: !selectedWorkingCalendar,
        onClick: (): void => {
          dispatch(selectWorkingCalendar(undefined));
        },
      });
    }

    if (selectedWorkingCalendar) {
      bc.push({
        key: 2,
        content: t('Date schedule'),
        active: !selectedWorkingCalendarDay,
        onClick: (): void => {
          dispatch(selectWorkingCalendarDay(undefined));
        },
      });
    }

    if (selectedWorkingCalendarDay) {
      bc.push({
        key: 3,
        content: t('Hour schedule'),
        active: true,
      });
    }

    return bc;
  }, [
    dispatch,
    selectedHospital,
    selectedWorkingCalendarDay,
    selectedWorkingCalendar,
    t
  ]);

  return (
    <>
      {scheduleCreatingList.length > 0 && (
        <Message color="blue" size="small">
          <MessageContent>
            <MessageLeftContent>
              <Loader active />
            </MessageLeftContent>
            <div>
              {t('Creating schedule')}:
              {` [${scheduleCreatingList
                .map((e) => `'${e.name}'`)
                .join(', ')}]`}
            </div>
          </MessageContent>
        </Message>
      )}

      {/* TODO: implement failedList re-create
      <Message color="red" size="small">
        <MessageContent>
          <MessageLeftContent>
            <FiXCircle />
          </MessageLeftContent>
          <div>
            Lịch tạo thất bại:
            {` [${scheduleCreatingList.map((e) => `'${e.name}'`).join(', ')}]`}
          </div>
          <Button primary basic content="Tạo lại" size="mini" />
        </MessageContent>
      </Message> */}

      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedHospital && <WorkingCalendarHospitalTable />}
      {selectedHospital && !selectedWorkingCalendar && <WorkingCalendarTable />}
      {selectedWorkingCalendar && !selectedWorkingCalendarDay && (
        <WorkingCalendarDayTable />
      )}
      {selectedWorkingCalendarDay && <WorkingCalendarIntervalTable />}
    </>
  );
};

export default WorkingSchedulePage;
