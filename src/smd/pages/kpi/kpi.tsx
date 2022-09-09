import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';

import { FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import { Indicator } from '@smd/models';
import IndicatorTable from '@smd/components/indicator-table';
import KPITable from '@smd/components/kpi-table';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const KPIPage: React.FC = () => {
  const { t } = useTranslation();

  const [selecting, setSelecting] = useState<Indicator>();

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selecting ? t('Select Indicator') : selecting.name,
        active: !selecting,
        onClick: (): void => setSelecting(undefined),
      },
    ];

    if (selecting) {
      bc.push({
        key: 1,
        content: 'KPI',
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
      {!selecting && <IndicatorTable onSelect={setSelecting} />}
      {selecting && <KPITable indicator={selecting} />}
    </>
  );
};

export default KPIPage;
