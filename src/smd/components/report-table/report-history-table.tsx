import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useDispatch } from '@app/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { getReportHistories } from '@smd/redux/report';
import { getIndicators } from '@smd/redux/indicator';
import { CollectionResponse, Report, ReportHistory } from '@smd/models';

import DataTable, { Column } from '@app/components/data-table';

import { toServerTime } from '@app/utils/helpers';
import { Label } from 'semantic-ui-react';

interface Props {
  reportId: Report['id'];
}

const ReportHistoryTable: React.FC<Props> = ({ reportId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [historyData, setHistoryData] = useState<
    CollectionResponse<ReportHistory>
  >();
  const [loading, setLoading] = useState(false);
  const { data, pageCount } = historyData || { data: [], pageCount: 0 };

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const getData = useCallback(() => {
    if (reportId) {
      const fetch = async () => {
        setLoading(true);
        dispatch(getIndicators());
        const result = unwrapResult(
          await dispatch(getReportHistories({ reportId, pageIndex, pageSize })),
        );
        setLoading(false);
        setHistoryData(result);
      };
      fetch();
    }
  }, [dispatch, reportId, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<ReportHistory>[] => [
      {
        header: t('Create Date'),
        accessor: 'dateCreated',
        render: (r) => toServerTime(r.dateCreated),
      },
      {
        header: t('Create By'),
        accessor: 'createBy',
      },
      {
        header: t('Create Method'),
        accessor: 'createdMethod',
        render: (r) => (r.createdMethod === 0 ? 'Form' : 'Import'),
      },
      {
        header: t('Update Date'),
        accessor: 'dateUpdated',
        render: (r) => toServerTime(r.dateUpdated),
      },
      {
        header: t('Value'),
        accessor: 'value',
        render: ({ value }) => <Label basic color="yellow" content={value} />,
      },
    ],
    [t],
  );
  return (
    <>
      <DataTable
        title={t('Report History')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={loading}
      />
    </>
  );
};

export default ReportHistoryTable;
