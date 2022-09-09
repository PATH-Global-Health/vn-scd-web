/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Label, Header } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { Column, Row, TableInstance } from 'react-table';

import GroupDataTable from '@app/components/data-table/GroupDataTable';
import { toVND } from '@app/utils/helpers';
import { useDispatch, useSelector } from '@app/hooks';
import { getEfficiency } from '@smd/redux/report';
import { EfficiencyRecord } from '@smd/models';

import locations from '@app/assets/mock/locations.json';
import { Filter } from '../dashboard/DashboardFilter';

interface PerformanceRating {
  name: string;
  background: string;
  color: string;
}

const Wrapper = styled.div`
  padding: 6px 6px 20px 6px;
  margin-top: 8px;
  background: white;
`;
const LabelWrapper = styled.div`
  margin-top: 8px;
  & > span:first-child {
    font-weight: bold;
    text-decoration: underline;
    margin-right: 10px;
  }
  & > span:last-child {
    float: right;
  }
`;

interface Props {
  filter?: Filter;
}

const renderPercentage = (value: number): string => {
  if (Number.isNaN(value)) {
    return '- ';
  }
  if (!Number.isFinite(value)) {
    return '∞ ';
  }
  return `${parseFloat(value.toString()).toFixed()}%`;
};

const EfficiencyTable: React.FC<Props> = ({ filter }) => {
  const { t } = useTranslation();

  const performanceRating: PerformanceRating[] = useMemo(
    () => [
      { name: t('Excelent (>100%)'), background: 'royalblue', color: 'white' },
      { name: t('Good (80-100)%'), background: 'green', color: 'white' },
      { name: t('Average (60-79)%'), background: 'gold', color: 'black' },
      { name: t('Need Improvement (<60%)'), background: 'red', color: 'white' },
    ],
    [t],
  );

  const dispatch = useDispatch();
  const { data: indicatorList } = useSelector(
    (s) => s.smd.indicator.indicatorData,
  );
  const efficiencyList = useSelector((s) => s.smd.report.efficiencyList);
  const getLoading = useSelector((s) => s.smd.report.getEfficiencyLoading);
  const confirmedARV = indicatorList.find(({ name }) =>
    name.includes('TX_NEW'),
  );
  const confirmedPrEP = indicatorList.find(({ name }) =>
    name.includes('PrEP_NEW'),
  );
  useEffect(() => {
    dispatch(
      getEfficiency({
        ...filter,
        indicators: [confirmedARV, confirmedPrEP].map((e) => e?.id ?? ''),
      }),
    );
    // eslint-disable-next-line
  }, [dispatch, filter]);

  const getTotal = useCallback((info: TableInstance, key: string): number => {
    return info.rows.reduce(
      (sum: number, row: Row) => sum + (Number(row.values[key]) || 0),
      0,
    );
  }, []);
  const getAverage = useCallback((info: TableInstance, key: string): string => {
    const filtered = info.rows.filter((r) => Number(r.values[key]));
    const total = filtered.reduce(
      (sum: number, row: Row) => sum + (Number(row.values[key]) || 0),
      0,
    );
    const result = total / filtered.length;
    return renderPercentage(result);
  }, []);

  const columns = useMemo(
    (): Column[] => [
      {
        Header: ' ',
        columns: [
          {
            accessor: 'projectName',
            Header: t('Project').toString(),
          },
          { accessor: 'cboName', Header: 'CBO', Footer: ' ' },
          {
            accessor: 'province',
            Header: t('Province/City').toString(),
            Footer: ' ',
          },
          {
            accessor: 'dateTime',
            Header: t('Reporting Period').toString(),
            Cell: ({
              row: { original: r },
            }: {
              row: { original: EfficiencyRecord };
            }) => moment(r.dateTime).format('MM-YYYY'),
            Aggregated: ({ value }) => value as string,
            disableGroupBy: true,
          },
        ],
      },
      {
        Header: t('TX_NEW verified').toString(),
        columns: [
          {
            accessor: 'tx_new__1',
            Header: t('Result').toString(),
            Footer: (info) => getTotal(info, 'tx_new__1'),
            aggregate: 'sum',
            Aggregated: ({ value }) => <b>{value as string}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: 'sum',
            accessor: 'tx_new__1Target',
            Header: t('Target').toString(),
            Footer: (info) => getTotal(info, 'tx_new__1Target'),
            Aggregated: ({ value }) => <b>{value as string}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: (a) => {
              const filtered = a.filter((e) => !Number.isNaN(e));
              const sum = Number(
                filtered.reduce((x: number, y: number) => x + y, 0),
              );
              return sum / filtered.length || 0;
            },
            accessor: 'arvPerformance',
            Header: t('Performance').toString(),
            disableGroupBy: true,
            Footer: (info) => getAverage(info, 'arvPerformance'),
            Cell: ({ value }) => renderPercentage(value),
            Aggregated: ({ value: v }) => <b>{renderPercentage(v)}</b>,
          },
        ],
      },
      {
        Header: t('PrEP_NEW verified').toString(),
        columns: [
          {
            aggregate: 'sum',
            accessor: 'prep_new__2',
            Header: t('Result').toString(),
            Footer: (info) => getTotal(info, 'prep_new__2'),
            Aggregated: ({ value }) => <b>{value as string}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: 'sum',
            accessor: 'prep_new__2Target',
            Header: t('Target').toString(),
            Footer: (info) => getTotal(info, 'prep_new__2Target'),
            Aggregated: ({ value }) => <b>{value as string}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: (a) => {
              const filtered = a.filter((e) => !Number.isNaN(e));
              const sum = Number(
                filtered.reduce((x: number, y: number) => x + y, 0),
              );
              return sum / filtered.length || 0;
            },
            accessor: 'prepPerformance',
            Header: t('Performance').toString(),
            disableGroupBy: true,
            Footer: (info) => getAverage(info, 'prepPerformance'),
            Cell: ({ value }) => renderPercentage(value),
            Aggregated: ({ value: v }) => <b>{renderPercentage(v)}</b>,
          },
        ],
      },
      {
        Header: t('Payment').toString(),
        columns: [
          {
            aggregate: 'sum',
            accessor: 'payment',
            Header: t('Result').toString(),
            Footer: (info) => toVND(getTotal(info, 'payment')),
            Cell: ({
              row: { original },
            }: {
              row: { original: EfficiencyRecord };
            }) => toVND(original.payment),
            Aggregated: ({ value }) => <b>{toVND(value)}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: 'sum',
            accessor: 'paymentTarget',
            Header: t('Target').toString(),
            Footer: (info) => toVND(getTotal(info, 'paymentTarget')),
            Cell: ({
              row: { original },
            }: {
              row: { original: EfficiencyRecord };
            }) => toVND(original.paymentTarget),
            Aggregated: ({ value }) => <b>{toVND(value)}</b>,
            disableGroupBy: true,
          },
          {
            aggregate: (a) => {
              const filtered = a.filter((e) => !Number.isNaN(e));
              const sum = Number(
                filtered.reduce((x: number, y: number) => x + y, 0),
              );
              return sum / filtered.length || 0;
            },
            accessor: 'paymentPerformance',
            Header: t('Performance').toString(),
            disableGroupBy: true,
            Cell: ({ value }) => renderPercentage(value),
            Footer: (info) => getAverage(info, 'paymentPerformance'),
            Aggregated: ({ value: v }) => <b>{renderPercentage(v)}</b>,
          },
        ],
      },
    ],
    [t, getTotal, getAverage],
  );

  const data = useMemo(() => {
    if (indicatorList.length) {
      const result = [
        ...efficiencyList
          .map((d) => ({
            ...d,
            indicatorName: t(
              `${
                indicatorList.find((e) => e.id === d.indicatorId)?.name ?? ''
              }`,
            ),
            indicatorCode:
              indicatorList.find((e) => e.id === d.indicatorId)?.code ?? '',
          }))
          .reduce((d, m) => {
            const key = `${m.cboName}-${m.dateTime}-${m.province}`;
            const obj = d.get(key);
            const target = `${m.indicatorCode.toLowerCase()}Target`;
            return obj
              ? d.set(key, {
                  ...obj,
                  province:
                    locations.find(
                      (p) => Number(p.value) === Number(m.province),
                    )?.label ?? '',
                  [m.indicatorCode.toLowerCase()]: m.value,
                  [target]: m.targetValue,
                })
              : d.set(key, {
                  ...m,
                  province:
                    locations.find(
                      (p) => Number(p.value) === Number(m.province),
                    )?.label ?? '',
                  [m.indicatorCode.toLowerCase()]: m.value,
                  [target]: m.targetValue,
                });
          }, new Map())
          .values(),
      ];
      return result.map((r) => {
        const d = r as EfficiencyRecord;
        return {
          ...d,
          arvPerformance: (d.tx_new__1 / d.tx_new__1Target) * 100,
          prepPerformance: (d.prep_new__2 / d.prep_new__2Target) * 100,
          paymentPerformance: (d.payment / d.paymentTarget) * 100,
        };
      });
    }
    return [];
  }, [t, efficiencyList, indicatorList]);

  return (
    <Wrapper>
      <Header
        as="h5"
        style={{ margin: 0 }}
        content={t(
          'Delivery performance tracking and payment according to package',
        ).toString()}
      />
      <Header
        as="h5"
        style={{ margin: 0, background: 'lightgrey', textAlign: 'right' }}
        content={t(
          'Referral to treatment service/Results/Standards/Performance',
        ).toString()}
      />
      <GroupDataTable
        groupBy
        loading={getLoading}
        data={data}
        columns={columns}
      />
      <LabelWrapper>
        <span>{t('Performance of service referal legend:').toString()}</span>
        <span>
          {performanceRating.map((p) => (
            <Label
              as="a"
              size="large"
              style={p}
              key={p.name}
              content={p.name}
            />
          ))}
        </span>
      </LabelWrapper>
    </Wrapper>
  );
};

export default EfficiencyTable;
