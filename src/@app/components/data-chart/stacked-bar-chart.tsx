/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import styled from 'styled-components';

import {
  Dropdown,
  Header,
  Input,
  Dimmer,
  Loader,
  Icon,
} from 'semantic-ui-react';

import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';

import { useDispatch } from '@app/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { getBarChart } from '@smd/redux/report';
import { GroupByType } from '@smd/models/report';
import { Indicator, BarChartResponse } from '@smd/models';

import locations from '@app/assets/mock/locations.json';

import { isDarkTextInChart } from '@app/utils/helpers';
import { Filter } from '@smd/components/dashboard/DashboardFilter';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ChartDataLabels,
);

const Wrapper = styled.div`
  position: relative;
  background: white;
  padding: 8px;
`;
const Pagination = styled.div`
  position: absolute;
  right: 0;
  top: 2%;
`;

interface DataLabels {
  align: string;
  anchor: string;
}
interface DataSet {
  label: string;
  data: number[];
  backgroundColor: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  barPercentage?: number;
  barThickness?: number;
  maxBarThickness?: number;
  minBarLength?: number;
  datalabels?: DataLabels;
}

export enum ChartSize {
  BIG = 'big',
  NORMAL = 'normal',
  SMALL = 'small',
}
interface Props {
  title: string;
  filter?: Filter;
  multipleAxis?: boolean;
  groupByType: GroupByType;
  firstIndicator?: Indicator;
  secondIndicator?: Indicator;
  thirdIndicator?: Indicator;
  primary: string;
  secondary: string;
  tertiary?: string;
  fullscreen?: string;
  setFullscreen: (title?: string) => void;
}

const getBarValue = (context: Context): number => {
  return Number(context.dataset.data[context.dataIndex]);
};

const getMaxValue = (datasets: DataSet[]): number => {
  const values = _.flatMapDeep(datasets.map((e) => e.data));
  return Math.max(...values);
};

const getNumberOfDataSet = (datasets: DataSet[]): number => {
  const values = _.flatMapDeep(datasets.map((e) => e.data));
  return Math.ceil(Math.sqrt(values.length));
};

const colors = [
  '#349db4',
  '#559f7a',
  '#a20b19',
  '#5260a9',
  '#e17646',
  '#dbbe5d',
  '#9cc062',
  '#3a8bc2',
  '#677d87',
  '#af69a0',
];

const StackedBarChart: React.FC<Props> = ({
  title,
  filter,
  primary,
  secondary,
  tertiary,
  fullscreen,
  groupByType,
  multipleAxis,
  firstIndicator,
  secondIndicator,
  thirdIndicator,
  setFullscreen,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [maxData, setMaxData] = useState(0);
  const getData = useCallback(() => {
    const getBarData = async () => {
      setLoading(true);
      const response = unwrapResult(
        await dispatch(
          getBarChart({
            ...filter,
            cbOs: filter?.cbOs ?? [],
            implementingPartners: filter?.implementingPartners ?? [],
            psnUs: filter?.psnUs ?? [],
            indicators: [firstIndicator, secondIndicator, thirdIndicator]
              .filter((e) => Boolean(e?.id))
              .map((e) => e?.id ?? ''),
            groupByType,
            pageSize,
            pageIndex: 0,
          }),
        ),
      );

      let _labels = [
        ...new Set(
          response.map(({ label }) =>
            groupByType === GroupByType.PROVINCE
              ? locations.find((e) => e.value === label)?.label ?? ''
              : label,
          ),
        ),
      ];

      setLabels(_labels);

      const result: any[] = [];

      let initData: number[] = [];
      _labels.forEach((_) => initData.push(0));

      response.forEach((item) => {
        let name = `${item.packageCode} - ${t('Total')}`;
        let index = result.findIndex((_) => _.indicatorName == name);
        if (!(index > -1)) {
          let p = {
            indicatorId: uuidv4(),
            indicatorName: name,
            backgroundColor: '',
            data: [...initData],
            stack: 0,
          };
          result.push(p);
        }
        name = `${item.packageCode} - ${t('Count')}`;
        index = result.findIndex((_) => _.indicatorName == name);
        if (!(index > -1)) {
          let p = {
            indicatorId: uuidv4(),
            indicatorName: name,
            backgroundColor: '',
            data: [...initData],
            stack: 0,
          };
          result.push(p);
        }
      });

      response.forEach((item) => {
        let name = `${item.packageCode} - ${t('Total')}`;
        let index = result.findIndex((_) => _.indicatorName == name);
        let color = colors[index % 10];
        if (index > -1) {
          let dataIndex = _labels.findIndex((_) => _ == item.label);
          result[index].data[dataIndex] = item.data;
          result[index].backgroundColor = color;
        }
        name = `${item.packageCode} - ${t('Count')}`;
        index = result.findIndex((_) => _.indicatorName == name);
        if (index > -1) {
          let dataIndex = _labels.findIndex((_) => _ == item.label);
          result[index].data[dataIndex] = item.packageNumber;
          result[index].backgroundColor = color;
        }
      });

      let max = 0;
      result.forEach((r) =>
        r.data.forEach((d: number) => (max = Math.max(max, d))),
      );
      setMaxData(max * 1.3);

      setDatasets(
        result.map((e, i) => ({
          ...e,
          data: _.flatMapDeep([e.data]),
          label: (e.indicatorName ?? t('Package paid count')) as string,
          backgroundColor: e.backgroundColor,
        })),
      );
      setLoading(false);
    };
    getBarData();
    // eslint-disable-next-line
  }, [dispatch, filter, groupByType, pageSize]);

  useEffect(getData, [getData]);

  // style for own chart
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        suggestedMax: maxData,
        position: 'left' as const,
        grid: {
          display: false,
        },
        ticks: {
          major: {
            enabled: true,
          },
          callback: (tickValue: string | number): string | number => {
            if (Number(tickValue) / 1000000 > 1) {
              return `${Number(tickValue) / 1000000} Tr`;
            }
            return tickValue;
          },
        },
      },
      y1: {
        stacked: true,
        grid: {
          display: false,
        },
        display: Boolean(multipleAxis),
        position: 'right' as const,
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // style for each dataset
  const data = {
    // project/cbo/province name
    labels,
    datasets: datasets.map((d, i) => ({
      ...d,
      yAxisID: multipleAxis && i % 2 ? 'y1' : 'y',
      stack: d.label.includes(t('Total')) ? '0' : '1',
      datalabels: {
        color: (context: Context) => {
          return '#ffffff';
        },
        formatter: (value: number): string | number => {
          if (value == 0) {
            return '';
          }
          if (value / 1000000 > 1) {
            return `${Math.round(value / 1000000)} Tr`;
          }
          return value;
        },
      },
    })),
  };

  //  (
  //   secondIndicator?.name ?? '',
  //   firstIndicator?.name ?? '',
  //   data.datasets,
  // );

  return (
    <Wrapper>
      <Dimmer active={loading} inverted>
        <Loader />
      </Dimmer>
      <Pagination>
        <Icon
          style={{ cursor: 'pointer' }}
          name={fullscreen ? 'zoom out' : 'zoom in'}
          onClick={() => setFullscreen(fullscreen ? '' : title)}
        />
        <Dropdown
          floating
          className="icon"
          icon="ellipsis vertical"
          direction="left"
        >
          <Dropdown.Menu>
            <Input
              size="mini"
              type="number"
              onClick={(e: SyntheticEvent) => e.stopPropagation()}
              onKeyDown={(e: KeyboardEvent) => {
                const target = e.target as HTMLTextAreaElement;
                if (e.key === 'Enter' && target && target.value) {
                  setPageSize(Number(target.value));
                }
              }}
              placeholder={t('Data quantity').toString()}
            />
            <Dropdown.Divider />
          </Dropdown.Menu>
        </Dropdown>
      </Pagination>
      <Header style={{ margin: '8px 40px 8px 0' }} as="h4" content={title} />
      <Bar options={options} data={data} />
    </Wrapper>
  );
};

export default StackedBarChart;
