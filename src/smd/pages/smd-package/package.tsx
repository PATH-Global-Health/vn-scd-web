import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';

import { FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import PackageTable from '@smd/components/package-table';

const PackagePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PackageTable  />
    </>
  );
};

export default PackagePage;
