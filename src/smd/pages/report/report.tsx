import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { Report } from '@smd/models';

import ReportTable from '@smd/components/report-table';
import ReportHistoryTable from '@smd/components/report-table/report-history-table';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const PersonalDataPage: React.FC = () => {
  const { t } = useTranslation();

  const [selecting, setSelecting] = useState<Report>();

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selecting ? t('Report Management') : t('Back'),
        active: !selecting,
        onClick: (): void => setSelecting(undefined),
      },
    ];

    if (selecting) {
      bc.push({
        key: 1,
        content: t('History'),
        active: true,
      });
    }

    return bc;
  }, [selecting, t]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selecting && <ReportTable onSelect={setSelecting} />}
      {selecting && <ReportHistoryTable reportId={selecting?.id ?? ''} />}
    </>
  );
};

export default PersonalDataPage;
