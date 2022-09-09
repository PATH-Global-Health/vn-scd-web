import React, { useEffect, useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';

import { selectHospital } from './examination.slice';
import BookingExamination from './components/BookingExamination';
import ExaminationHospitalTable from './components/ExaminationHospitalTable';
import { useTranslation } from 'react-i18next';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const ExaminationPage: React.FC = () => {
  const { t } = useTranslation();
  const { selectedHospital } = useSelector((state) => state.csyt.examination);

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
          dispatch(selectHospital(undefined));
        },
      },
    ];

    if (selectedHospital) {
      bc.push({
        key: 1,
        content: t('Appointment Schedule'),
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedHospital, t]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedHospital && <ExaminationHospitalTable />}
      {selectedHospital && <BookingExamination />}
    </>
  );
};

export default ExaminationPage;
