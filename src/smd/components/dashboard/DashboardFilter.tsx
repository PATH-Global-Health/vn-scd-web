import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { DropdownItemProps, Form, Grid } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { useAuth, useDispatch, useSelector } from '@app/hooks';
import { CBO, Project } from '@smd/models';

import locations from '@app/assets/mock/locations.json';
import { DatePicker } from '@app/components/date-picker';
import { removeVietnameseTones } from '@smd/utils/stringTool';
import { unwrapResult } from '@reduxjs/toolkit';
import { getListCBOsWithData, getListProvincesWithData } from '@smd/redux/cbo';

const StyledGrid = styled(Grid)`
  padding: ${(props) => (props.filter === 1 ? '8px 0' : '4px')} !important;
  width: calc(100% - 6px);

  margin: 0 !important;
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

const StyledButton = styled(Form.Button)`
  margin-top: 4px !important;
  margin-bottom: 4px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
`;

export interface Filter {
  reportingPeriod?: number;
  implementingPartners?: string[];
  cbOs?: string[];
  psnUs?: string[];
  dateTimes?: string[];
}

export interface QuarterOption {
  name: string;
  from: Date;
  to: Date;
}

interface Props {
  isFilter?: boolean;
  cbos: CBO[];
  projects: Project[];
  onChange: (data: Filter) => void;
  onExportExcel: (data: Filter) => void;
}
const DashboardFilter: React.FC<Props> = ({
  cbos: cboOptions,
  projects: projectOptions,
  isFilter,
  onChange,
  onExportExcel,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const quarters: QuarterOption[] = [
    {
      name: '02-2021',
      from: new Date(2021, 3, 1),
      to: new Date(2021, 5, 30),
    },
    {
      name: '03-2021',
      from: new Date(2021, 6, 1),
      to: new Date(2021, 8, 30),
    },
    {
      name: '04-2021',
      from: new Date(2021, 9, 1),
      to: new Date(2021, 11, 31),
    },
    {
      name: '01-2022',
      from: new Date(2022, 0, 1),
      to: new Date(2022, 2, 31),
    },
    {
      name: '02-2022',
      from: new Date(2022, 3, 1),
      to: new Date(2022, 5, 30),
    },
  ];

  const projectInfo = useSelector((s) => s.smd.project.projectInfo);
  const getProjectByTokenLoading = useSelector(
    (s) => s.smd.project.getProjectByTokenLoaing,
  );
  const cboInfo = useSelector((s) => s.smd.cbo.cboInfo);
  const getProjectsLoading = useSelector(
    (s) => s.smd.project.getProjectsLoading,
  );
  const getCBOsLoading = useSelector((s) => s.smd.cbo.getCBOsLoading);

  const [reportingPeriod, setReportingPeriod] = useState<number>(0);
  const [implementingPartners, setImplementingPartners] = useState<string[]>();
  const [cbOs, setCbOs] = useState<string[]>();
  const [psnUs, setPsnUs] = useState<string[]>();

  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const [provinces, setProvinces] = useState<string[]>();
  const [cbos, setCBOs] = useState<string[]>();

  const handleExportExcel = useCallback(() => {
    ('here');
    const dateTimes: string[] = [];
    if (from != null && to != null) {
      const mf = moment(from);
      const mt = moment(to);
      while (mt > mf || mf.format('M') === mt.format('M')) {
        dateTimes.push(mf.format('YYYY-MM-01'));
        mf.add(1, 'month');
      }
    }
    onExportExcel({
      reportingPeriod: 0,
      implementingPartners,
      cbOs,
      psnUs,
      dateTimes,
    });
  }, [
    onExportExcel,
    from,
    to,
    reportingPeriod,
    implementingPartners,
    cbOs,
    psnUs,
  ]);

  const onSearch = useCallback(() => {
    const dateTimes: string[] = [];
    if (from != null && to != null) {
      const mf = moment(from);
      const mt = moment(to);
      while (mt > mf || mf.format('M') === mt.format('M')) {
        dateTimes.push(mf.format('YYYY-MM-01'));
        mf.add(1, 'month');
      }
    }
    onChange({
      reportingPeriod: 0,
      implementingPartners,
      cbOs,
      psnUs,
      dateTimes,
    });
  }, [onChange, from, to, reportingPeriod, implementingPartners, cbOs, psnUs]);

  const onReset = useCallback(() => {
    setReportingPeriod(0);
    setImplementingPartners(undefined);
    setCbOs(undefined);
    setPsnUs(undefined);
    setFrom(null);
    setTo(null);
  }, []);

  const customFilter = useCallback(
    (options: DropdownItemProps[], value: string) => {
      const _ = removeVietnameseTones(value)?.toLocaleLowerCase();
      return options.filter((s) =>
        removeVietnameseTones(s.text?.toString())
          ?.toLocaleLowerCase()
          .includes(_ ?? ''),
      );
    },
    [],
  );

  const { isProject, isCBO } = useAuth();

  const renderOptions = useCallback(() => {
    if (isProject) {
      const cboOps = cboOptions
        .filter((c) => c.projectId === projectInfo?.id ?? '')
        .map((c) => ({
          key: c.id,
          province: c.province,
          text: c.name,
          value: c.id,
        }));
      return {
        projectOptions: projectOptions
          .filter((p) => p.id === projectInfo?.id ?? '')
          .map((p) => ({ text: p.name, value: p.id })),
        cboOptions: cboOps,
      };
    }
    if (isCBO && cboInfo) {
      return {
        projectOptions: projectOptions
          .filter((p) => p.id === cboInfo?.projectId ?? '')
          .map((p) => ({ text: p.name, value: p.id })),
        cboOptions: [cboInfo].map((c) => ({
          key: c?.id,
          text: c?.name,
          value: c?.id,
        })),
      };
    }

    return {
      projectOptions: projectOptions.map((p) => ({
        text: p.name,
        value: p.id,
      })),
      cboOptions: cboOptions
        .filter((s) => cbos?.includes(s.code))
        .map((c) => ({
          key: c.id,
          text: c.name,
          value: c.id,
        })),
    };
  }, [cboInfo, isProject, isCBO, projectInfo, projectOptions, cboOptions]);

  useEffect(() => {
    const get = async () => {
      const p = unwrapResult(await dispatch(getListProvincesWithData()));
      const c = unwrapResult(await dispatch(getListCBOsWithData()));
      setProvinces(p);
      setCBOs(c);
    };
    get();
  }, [dispatch]);

  return (
    <StyledGrid filter={isFilter ? 1 : 0}>
      <Grid.Row columns={4}>
        <Grid.Column>
          <Form.Select
            fluid
            search={customFilter}
            deburr
            clearable
            label={t('Reporting Period').toString()}
            value={
              reportingPeriod || reportingPeriod === 0 ? reportingPeriod : ''
            }
            options={[
              { value: 0, text: t('Month') },
              { value: 1, text: t('Quarter') },
            ]}
            onChange={(_, { value: v }): void => {
              setReportingPeriod(Number(v));
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search={customFilter}
            deburr
            multiple
            clearable
            value={implementingPartners || []}
            loading={getProjectsLoading || getProjectByTokenLoading}
            label={t('Implementing Partners').toString()}
            options={renderOptions().projectOptions}
            onChange={(_, { value: v }) => {
              setImplementingPartners(v as string[]);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search={customFilter}
            deburr
            multiple
            clearable
            value={cbOs || []}
            loading={getCBOsLoading}
            label={t('CBOs Name').toString()}
            options={renderOptions().cboOptions}
            onChange={(_, { value: v }): void => {
              setCbOs(v as string[]);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            fluid
            search={customFilter}
            deburr
            multiple
            clearable
            value={psnUs || []}
            label={t('PSNUs').toString()}
            options={locations
              .filter((s) => provinces?.includes(s.value))
              .map((p) => ({
                text: p.label,
                value: p.value,
              }))}
            onChange={(_, { value: v }): void => {
              setPsnUs(v as string[]);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      {reportingPeriod === 0 && (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Field
              fluid
              control={DatePicker}
              value={from}
              label={t('From date').toString()}
              onChange={(value: Date) => setFrom(value)}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              value={to}
              control={DatePicker}
              label={t('To date').toString()}
              disabledDays={(d: Date) => {
                return (
                  moment(from).format('YYYY-MM-DD') >
                  moment(d).format('YYYY-MM-DD')
                );
              }}
              onChange={(value: Date) => setTo(value)}
            />
          </Grid.Column>
        </Grid.Row>
      )}
      {reportingPeriod === 1 && (
        <Grid.Row columns={1}>
          <Grid.Column>
            <Form.Select
              fluid
              search={customFilter}
              deburr
              clearable
              label={t('Select quarter').toString()}
              options={quarters.map((p) => ({
                text: p.name,
                value: p.name,
              }))}
              onChange={(_, { value: v }): void => {
                const selectedQ = quarters.find((s) => s.name === v);
                if (selectedQ != null) {
                  setFrom(selectedQ?.from);
                  setTo(selectedQ?.to);
                }
              }}
            />
          </Grid.Column>
        </Grid.Row>
      )}
      <Grid.Row columns={2}>
        <Grid.Column floated="left" width={6}>
          <Grid textAlign="left" columns={1}>
            <Grid.Row>
              <Grid.Column>
                <div style={{ width: '100%', display: 'flex' }}>
                  <StyledButton
                    primary
                    labelPosition="right"
                    icon="sync"
                    content={t('Reset').toString()}
                    onClick={onReset}
                  />
                  <StyledButton
                    color="twitter"
                    labelPosition="right"
                    icon="filter"
                    content={t('Apply').toString()}
                    onClick={onSearch}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column floated="right" width={6}>
          <Grid textAlign="right" columns={1}>
            <Grid.Row>
              <Grid.Column>
                <StyledButton
                  labelPosition="right"
                  icon="file excel"
                  content={t('Export Excel').toString()}
                  onClick={handleExportExcel}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </StyledGrid>
  );
};

export default DashboardFilter;
