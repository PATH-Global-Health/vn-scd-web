import React from 'react';
import styled from 'styled-components';

import { Dimmer, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { useSelector } from '@app/hooks';

const StyledGrid = styled(Grid)`
  color: white !important;
  background-color: ${({ background }) => background as string};
`;
const StyledHeader = styled(Header)`
  color: white !important;
`;
const StyledColumnValue = styled(Grid.Column)`
  font-size: 45px;
  align-self: center !important;
`;
const StyledRowPercentage = styled(Grid.Row)`
  font-size: 30px;
`;
const StyledValue = styled.span`
  font-size: 30px;
`;
const NonPaddingRow = styled(Grid.Row)`
  padding-bottom: 0 !important;
`;
const BoldRow = styled(Grid.Row)`
  & > * {
    font-weight: 700 !important;
  }
`;
const HeaderColumn = styled(Grid.Column)`
  word-break: break-all;
  font-size: 45px;
  line-height: 45px;
`;

export enum Background {
  BLUE = 'royalblue',
  GREEN = 'seagreen',
  ORANGE = 'darkorange',
}

interface Info {
  title: string;
  value: string | number;
}

interface Props {
  header?: string;
  info: Info;
  subInfo: Info | null;
  background: Background;
}

const StatisticSection: React.FC<Props> = ({
  header,
  info,
  subInfo,
  background,
}) => {
  const getIndicatorLoading = useSelector(
    (s) => s.smd.indicator.getIndicatorsLoading,
  );
  const getSummaryLoading = useSelector((s) => s.smd.report.getSummaryLoading);

  return (
    <Grid.Column>
      <Dimmer active={getIndicatorLoading || getSummaryLoading} inverted>
        <Loader />
      </Dimmer>
      <Segment style={{ background, marginTop: '0' }}>
        {header ? (
          <StyledGrid>
            <BoldRow>
              <HeaderColumn width={3}>{header}</HeaderColumn>
              <Grid.Column width={5}>
                {subInfo?.title ?? ''}
                <br />
                <StyledValue>{subInfo?.value ?? '-'}</StyledValue>
              </Grid.Column>
              <Grid.Column width={8} textAlign="right">
                {info.title}
                <br />
                <StyledValue>{info?.value ?? '-'}</StyledValue>
              </Grid.Column>
            </BoldRow>
          </StyledGrid>
        ) : (
          <StyledGrid>
            <NonPaddingRow>
              <Grid.Column textAlign="right">
                <StyledHeader content={info.title} />
              </Grid.Column>
            </NonPaddingRow>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Grid.Row>
                  {subInfo?.title ?? ''}
                  &nbsp;
                </Grid.Row>
                <StyledRowPercentage>
                  {subInfo ? `${subInfo?.value ?? '-'}%` : ''}
                  &nbsp;
                </StyledRowPercentage>
              </Grid.Column>
              <StyledColumnValue textAlign="right">
                {info?.value ?? '-'}
              </StyledColumnValue>
            </Grid.Row>
          </StyledGrid>
        )}
      </Segment>
    </Grid.Column>
  );
};

export default StatisticSection;
