import React from 'react';
import styled from 'styled-components';

import { Grid } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { Background, StatisticSection } from '@smd/components/dashboard';
import { useSelector } from '@app/hooks';
import { ReadType, IndicatorSummary } from '@smd/models';
import { formatNumber } from '@app/utils/helpers';

const FIRST_INDICATOR_SIGNAL = '_1';
const FIRST_INDICATOR_WITH_RATE_SIGNAL = '__1';
const SECOND_INDICATOR_SIGNAL = '_2';
const SECOND_INDICATOR_WITH_RATE_SIGNAL = '__2';
const RATE_SIGNAL = 'RATE';

const StyledGrid = styled(Grid)`
  padding: 4px !important;
  margin: 8px 0 0 0 !important;
  background: white;

  & > div.row {
    padding: 2px 0 !important;
  }
  & > div.row:first-child {
    padding-bottom: 2px !important;
  }
  & > div.row:last-child {
    padding-top: 2px !important;
  }
  & div.row,
  & div.column {
    font-weight: 600;
  }
  & > div.row > div.column {
    padding: 4px !important;
  }
  & > div.row:first-child {
    padding-bottom: 0;
  }
  & > div.row:last-child {
    padding-top: 0;
  }
`;

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const summaryList = useSelector((s) => s.smd.report.summaryList);
  const indicatorList = useSelector((s) => s.smd.indicator.indicatorData.data);
  const mapped: IndicatorSummary[] = summaryList.map((e) => ({
    ...e,
    indicatorCode:
      indicatorList.find(({ id }) => id === e.indicatorId)?.code ?? '',
    indicatorName: t(
      `${indicatorList.find(({ id }) => id === e.indicatorId)?.name ?? ''}`,
    ),
  }));
  const firstIndicator = mapped.filter(
    ({ indicatorCode }) =>
      indicatorCode.includes(FIRST_INDICATOR_SIGNAL) &&
      !indicatorCode.includes(RATE_SIGNAL),
  );
  const secondIndicator = mapped.filter(
    ({ indicatorCode }) =>
      indicatorCode.includes(SECOND_INDICATOR_SIGNAL) &&
      !indicatorCode.includes(RATE_SIGNAL),
  );
  const thirdIndicator = mapped.filter(
    ({ valueType }) => valueType === 'MONEY',
  );
  const getRate = (
    list: IndicatorSummary[],
    code: string,
  ): { title: string; value: number } => {
    const d = list.find(
      (m) =>
        m.indicatorCode.includes(code) && m.indicatorCode.includes(RATE_SIGNAL),
    );
    return {
      title: t(`${d?.indicatorName ?? ''}`) ?? '',
      value: d?.value ?? 0,
    };
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledGrid columns={4} stretched>
        <Grid.Row>
          {firstIndicator.map((e) => (
            <StatisticSection
              key={e.indicatorId}
              info={{ title: t(e.indicatorName), value: formatNumber(e.value) }}
              subInfo={
                e.indicatorCode.includes(FIRST_INDICATOR_WITH_RATE_SIGNAL)
                  ? getRate(
                      mapped.map((m) => ({
                        ...m,
                        value: Number((m.value * 100).toFixed()),
                      })),

                      e.indicatorCode,
                    )
                  : null
              }
              background={Background.BLUE}
            />
          ))}
        </Grid.Row>
        <Grid.Row>
          {secondIndicator.map((e) => (
            <StatisticSection
              key={e.indicatorId}
              info={{ title: t(e.indicatorName), value: formatNumber(e.value) }}
              subInfo={
                e.indicatorCode.includes(SECOND_INDICATOR_WITH_RATE_SIGNAL)
                  ? getRate(
                      mapped.map((m) => ({
                        ...m,
                        value: Number((m.value * 100).toFixed()),
                      })),
                      e.indicatorCode,
                    )
                  : null
              }
              background={Background.GREEN}
            />
          ))}
        </Grid.Row>

        <Grid.Row>
          {thirdIndicator.map((e, i) => (
            <StatisticSection
              key={`${e.indicatorId}-${e.packageCode}`}
              header={`P \n ${Number.parseInt(e.packageCode.split('P')[1])}`}
              background={Background.ORANGE}
              info={{
                title: t('Total amount'),
                value: formatNumber(e.value)
                  ? `${formatNumber(
                      Number.parseInt((e.value / 1000000).toFixed()),
                    )}${t('Million')}`
                  : `- ${t('Million')}`,
              }}
              subInfo={{ title: t('Payment'), value: e.packageNumber }}
            />
          ))}
        </Grid.Row>
      </StyledGrid>
    </div>
  );
};

export default DashboardPage;
