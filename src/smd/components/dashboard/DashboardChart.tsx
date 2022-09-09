/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Grid } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { useSelector } from '@app/hooks';
import { Indicator } from '@smd/models';
import { GroupByType } from '@smd/models/report';

import BarChart from '@app/components/data-chart';
import { Filter } from './DashboardFilter';
import MultiTypeBarChart from '@app/components/data-chart/multitype-bart-chart';
import BarWithTargetChart from '@app/components/data-chart/bar-chart-with-target';
import StackedBarChart from '@app/components/data-chart/stacked-bar-chart';

interface Rows {
  index: number;
  rows: ChainData[];
}
interface ChainData {
  title: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  multipleAxis?: boolean;
  firstIndicator?: Indicator;
  secondIndicator?: Indicator;
  thirdIndicator?: Indicator;
  groupByType: GroupByType;
  withTarget?: boolean;
  noBorder?: boolean;
  targetPerformance?: boolean;
  isStacked?: boolean;
  performance?: {
    label?: string;
    numerator?: Indicator;
    denominator?: Indicator;
  };
}

interface Props {
  selected: number;
  filter?: Filter;
}

const StyledGrid = styled(Grid)`
  margin: 8px 0 0 0 !important;

  & > div.row {
    padding: 4px 0 !important;
  }
  & > div.row:first-child {
    padding-top: 2px !important;
  }
  & > div.row:last-child {
    padding-bottom: 2px !important;
  }
  & div.row,
  & div.column {
    font-weight: 600;
  }
  & > div.row:first-child {
    padding-bottom: 0;
  }
  & > div.row:last-child {
    padding-top: 0;
  }
  & > div.row > div.column:first-child {
    padding: 0 4px 0 0;
    background: whitesmoke;
  }
  & > div.row > div.column:last-child {
    padding: 0 0 0 4px;
    background: whitesmoke;
  }
`;

const DashboardChart: React.FC<Props> = ({ selected, filter }) => {
  const { t } = useTranslation();
  const indicatorList = useSelector((s) => s.smd.indicator.indicatorData.data);
  const positiveTesting = indicatorList.find(
    ({ name, code }) => code === 'HTS_POS_1',
  );
  const successfulART = indicatorList.find(
    ({ name, code }) => name.includes('ARV') && !code.includes('RATE'),
  );
  const confirmedARV = indicatorList.find(({ name }) =>
    name.includes('TX_NEW'),
  );
  const successfulPrEP = indicatorList.find(
    ({ name, code }) => name.includes('PrEP') && !code.includes('RATE'),
  );
  const confirmedPrEP = indicatorList.find(({ name }) =>
    name.includes('PrEP_NEW'),
  );
  const totalPayment = indicatorList.find(({ code }) =>
    code.includes('PAYMENT'),
  );

  const table: Rows[] = [
    {
      index: 2,
      rows: [
        {
          primary: '#64B6F5',
          secondary: '#1664C0',
          tertiary: '#123456',
          title: t(
            'Successful ART referral and new treatment verification by reporting period',
          ).toString(),
          groupByType: GroupByType.TIME,
          firstIndicator: confirmedARV,
          secondIndicator: successfulART,
          thirdIndicator: positiveTesting,
          performance: {
            label: t('%confirmedARV / successfulART'),
            numerator: confirmedARV,
            denominator: successfulART,
          },
        },
        {
          primary: '#C8E5C9',
          secondary: '#44A047',
          title: t(
            'Successful PrEP referral and new treatment verification by reporting period',
          ).toString(),
          groupByType: GroupByType.TIME,
          firstIndicator: confirmedPrEP,
          secondIndicator: successfulPrEP,
        },
        {
          primary: '#44A047',
          secondary: '#1664C0',
          title: t(
            'Verification of new ART and recent PrEP by reporting period',
          ).toString(),
          groupByType: GroupByType.TIME,
          withTarget: true,
          targetPerformance: true,
          firstIndicator: confirmedARV,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#F66D02',
          secondary: '#00B5CB',
          title: t('Performance-based payouts by reporting period').toString(),
          multipleAxis: true,
          isStacked: true,
          groupByType: GroupByType.TIME,
          firstIndicator: totalPayment,
          // secondIndicator: successfulART,
        },
      ],
    },
    {
      index: 3,
      rows: [
        {
          primary: '#64B6F5',
          secondary: '#1664C0',
          tertiary: '#123456',
          title: t(
            'Successful ART referral and verification of new treatment by project/implementation partner',
          ).toString(),
          groupByType: GroupByType.PROJECT,
          firstIndicator: positiveTesting,
          secondIndicator: successfulART,
          thirdIndicator: confirmedARV,
          noBorder: true,
          performance: {
            label: t('%confirmedARV / successfulART'),
            numerator: confirmedARV,
            denominator: successfulART,
          },
        },
        {
          primary: '#C8E5C9',
          secondary: '#44A047',
          title: t(
            'Successful transfer of PrEP and verification of new treatment according to the project/implementation partner',
          ).toString(),
          groupByType: GroupByType.PROJECT,
          firstIndicator: successfulPrEP,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#44A047',
          secondary: '#1664C0',
          title: t(
            'Verification of new ART and new PrEP by project/implementation partner',
          ).toString(),
          groupByType: GroupByType.PROJECT,
          firstIndicator: confirmedARV,
          secondIndicator: confirmedPrEP,
          withTarget: true,
          noBorder: true,
          targetPerformance: false,
        },
        {
          primary: '#F66D02',
          secondary: '#00B5CB',
          title: t(
            'Performance-based pay by project/implementing partner',
          ).toString(),
          isStacked: true,
          multipleAxis: true,
          groupByType: GroupByType.PROJECT,
          firstIndicator: totalPayment,
          // secondIndicator: successfulART,
        },
      ],
    },
    {
      index: 4,
      rows: [
        {
          primary: '#64B6F5',
          secondary: '#1664C0',
          title: t(
            'Successful ART referral and new verification of treatment under CBO/Social Enterprise',
          ).toString(),
          groupByType: GroupByType.CBO,
          firstIndicator: successfulART,
          secondIndicator: confirmedARV,
        },
        {
          primary: '#C8E5C9',
          secondary: '#44A047',
          title: t(
            'Successful transfer of PrEP and new verification of treatment under CBO/Social Enterprise',
          ).toString(),
          groupByType: GroupByType.CBO,
          firstIndicator: successfulPrEP,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#44A047',
          secondary: '#1664C0',
          title: t(
            'Verification of new ART and new PrEP by CBO/Social Enterprise',
          ).toString(),
          groupByType: GroupByType.CBO,
          firstIndicator: confirmedARV,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#F66D02',
          secondary: '#00B5CB',
          title: t('Performance Pay by CBO/Social Enterprise').toString(),
          multipleAxis: true,
          groupByType: GroupByType.CBO,
          firstIndicator: totalPayment,
          // secondIndicator: successfulART,
        },
      ],
    },
    {
      index: 5,
      rows: [
        {
          primary: '#64B6F5',
          secondary: '#1664C0',
          title: t(
            'Successful ART referral and new treatment verification by province/city',
          ).toString(),
          groupByType: GroupByType.PROVINCE,
          firstIndicator: successfulART,
          secondIndicator: confirmedARV,
        },
        {
          primary: '#C8E5C9',
          secondary: '#44A047',
          title: t(
            'Successful PrEP referral and new treatment verification by province/city',
          ).toString(),
          groupByType: GroupByType.PROVINCE,
          firstIndicator: successfulPrEP,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#44A047',
          secondary: '#1664C0',
          title: t(
            'Verification of new ART and recent PrEP by province/city',
          ).toString(),
          groupByType: GroupByType.PROVINCE,
          firstIndicator: confirmedARV,
          secondIndicator: confirmedPrEP,
        },
        {
          primary: '#F66D02',
          secondary: '#00B5CB',
          title: t('Performance Payout by Province/City').toString(),
          multipleAxis: true,
          groupByType: GroupByType.PROVINCE,
          firstIndicator: totalPayment,
          // secondIndicator: successfulART,
        },
      ],
    },
  ];
  const [fullscreen, setFullscreen] = useState<string>();
  const fullscreenProps = table
    .map((r) => r.rows.find((e) => e.title === fullscreen))
    .filter((e) => e);

  return (
    <div style={{ position: 'relative' }}>
      {fullscreen ? (
        <Grid>
          <Grid.Row>
            <Grid.Column>
              {fullscreenProps.map((e) => {
                if (e != null) {
                  return e?.performance ? (
                    <MultiTypeBarChart
                      {...e}
                      key={`${fullscreen}-fullscreen`}
                      title={fullscreen}
                      groupByType={e?.groupByType ?? GroupByType.PROJECT}
                      filter={filter}
                      fullscreen={fullscreen}
                      setFullscreen={setFullscreen}
                    />
                  ) : (
                    <BarChart
                      {...e}
                      key={`${fullscreen}-fullscreen`}
                      primary={e?.primary ?? ''}
                      secondary={e?.secondary ?? ''}
                      title={fullscreen}
                      groupByType={e?.groupByType ?? GroupByType.PROJECT}
                      filter={filter}
                      fullscreen={fullscreen}
                      setFullscreen={setFullscreen}
                    />
                  );
                }
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <StyledGrid columns={2} stretched>
          {_.chunk(table.find((r) => r.index === selected)?.rows, 2).map(
            (r, i) => (
              <Grid.Row key={i}>
                {r.map((e) => (
                  <Grid.Column key={e.title}>
                    {e.performance ? (
                      <MultiTypeBarChart
                        {...e}
                        filter={filter}
                        setFullscreen={setFullscreen}
                      />
                    ) : e.withTarget ? (
                      <BarWithTargetChart
                        {...e}
                        filter={filter}
                        setFullscreen={setFullscreen}
                      />
                    ) : e.isStacked ? (
                      <StackedBarChart
                        {...e}
                        filter={filter}
                        setFullscreen={setFullscreen}
                      />
                    ) : (
                      <BarChart
                        {...e}
                        filter={filter}
                        setFullscreen={setFullscreen}
                      />
                    )}
                  </Grid.Column>
                ))}
              </Grid.Row>
            ),
          )}
        </StyledGrid>
      )}
    </div>
  );
};

export default DashboardChart;
