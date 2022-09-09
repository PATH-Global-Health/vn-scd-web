import React, { useEffect, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbSectionProps,
} from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { selectHospital } from '@csyt/working-schedule/working-schedule.slice';
import CustomersPageFilter from './CustomersPageFilter';
import CustomerHospitalTable from '../components/CustomerHospitalTable';
import { useTranslation } from 'react-i18next';
import { setSelectHospital } from '../slices/customer';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedHospital,
  } = useSelector((state) => state.admin.customer.customer);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectHospital(undefined));
  }, [dispatch]);

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selectedHospital ? t('Sub facility') : selectedHospital.name,
        active: !selectedHospital,
        onClick: (): void => {
          dispatch(setSelectHospital(undefined));
        },
      },
    ];

    if (selectedHospital) {
      bc.push({
        key: 1,
        content: t('Customer'),
        active: true,
        onClick: (): void => {
          // dispatch(selectWorkingCalendar(undefined));
        },
      });
    }

    return bc;
  }, [
    dispatch,
    selectedHospital,
    t
  ]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedHospital && <CustomerHospitalTable />}
      {selectedHospital && 
      // !selectedWorkingCalendar && 
      <CustomersPageFilter />}
      {/* {selectedWorkingCalendar && !selectedWorkingCalendarDay && (
        <WorkingCalendarDayTable />
      )}
      {selectedWorkingCalendarDay && <WorkingCalendarIntervalTable />} */}
    </>
  );
};

export default CustomersPage;
