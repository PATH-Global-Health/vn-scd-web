import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';

import { FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import { CBO } from '@smd/models';
import CBOTable from '@smd/components/cbo-table';
import ContractTable from '@smd/components/contract-table';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const CBOPage: React.FC = () => {
  const { t } = useTranslation();
  const [selecting, setSelecting] = useState<CBO>();

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selecting ? t('Select CBO') : selecting.name,
        active: !selecting,
        onClick: (): void => setSelecting(undefined),
      },
    ];

    if (selecting) {
      bc.push({
        key: 1,
        content: t('Contract'),
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
      {!selecting && <CBOTable onRowClick={setSelecting} />}
      {selecting && <ContractTable cbo={selecting} />}
    </>
  );
};

export default CBOPage;
