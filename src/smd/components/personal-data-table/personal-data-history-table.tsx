import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

import { Header, Table, Dimmer, Loader } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { useSelector } from '@app/hooks';

import { useDispatch } from 'react-redux';
import { PatientInfo } from '@smd/models';
import { getPatientInfoHistories } from '@smd/redux/patient-info';

import locations from '@app/assets/mock/locations.json';
import { toDay, toMonth, toYear } from '@app/utils/helpers';

import Pagination from '@app/components/data-table/Pagination';

const BLUE_PASTEL = '#BCD6ED';
const ROSE_PASTEL = '#FBE5D5';
const GREY_PASTEL = '#D0CECE';

const Wrapper = styled.div`
  position: relative;
  .ui.sortable.table thead th {
    border-left: none;
  }
`;
const TableWrapper = styled.div`
  table {
    margin-top: 0 !important;
  }
  .pointer {
    cursor: pointer;
  }
  & .text-bold {
    font-weight: bold !important;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 8px 0;
`;
const TableHeader = styled(Header)`
  margin-bottom: 0 !important;
  font-size: 28px !important;
`;
const ColorHeaderCell = styled(Table.HeaderCell)`
  background: ${({ color }) => color as string} !important;
`;
const ColorCell = styled(Table.Cell)`
  background: ${({ color }) => color as string} !important;
`;

interface Props {
  data: PatientInfo;
}
const PersonalDataHistoryTable: React.FC<Props> = ({ data: propData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, pageCount } = useSelector(
    (s) => s.smd.patientInfo.patientInfoHistoryData,
  );
  const getLoading = useSelector(
    (s) => s.smd.patientInfo.getPatientInfoHitoriesLoading,
  );

  const getData = useCallback(() => {
    if (propData) {
      dispatch(
        getPatientInfoHistories({
          patientInfoId: propData.id,
          pageIndex,
          pageSize,
        }),
      );
    }
  }, [dispatch, propData, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <Wrapper>
      <Dimmer inverted active={getLoading}>
        <Loader />
      </Dimmer>
      <ToolbarWrapper>
        <TableHeader content={t('History').toString()} />
      </ToolbarWrapper>
      <TableWrapper style={{ overflow: 'auto' }}>
        <Table celled structured singleLine size="small" textAlign="center">
          <Table.Header>
            <Table.Row>
              <ColorHeaderCell rowSpan="3">#</ColorHeaderCell>
              <ColorHeaderCell rowSpan="3">PSNU</ColorHeaderCell>
              <ColorHeaderCell rowSpan="3">
                MEDHANNISM OR PARTNER NAME
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="3">CBO NAME</ColorHeaderCell>
              <ColorHeaderCell rowSpan="3">
                Commune Health Supporter/ Outreach worker name
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="3">Reach Code</ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL} colSpan="7">
                HIV Testing service
              </ColorHeaderCell>
              <ColorHeaderCell color={ROSE_PASTEL} colSpan="6">
                Referral Services
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="3" color={GREY_PASTEL}>
                Referral slips certified by Facilities
              </ColorHeaderCell>
              <ColorHeaderCell colSpan="4" color={GREY_PASTEL}>
                Verification Result
              </ColorHeaderCell>
              <ColorHeaderCell colSpan="2" color={GREY_PASTEL}>
                Reporting Period
              </ColorHeaderCell>
              <ColorHeaderCell colSpan="3" color={GREY_PASTEL}>
                Updated Date
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="3" color={GREY_PASTEL}>
                Note
              </ColorHeaderCell>
            </Table.Row>
            <Table.Row>
              <ColorHeaderCell color={BLUE_PASTEL} rowSpan="2">
                Lay-testing code
              </ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL} rowSpan="2">
                HTC test code
              </ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL} rowSpan="2">
                HTC site
              </ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL} colSpan="3">
                Date of testing
              </ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL} rowSpan="2">
                Test result
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="2" color={ROSE_PASTEL}>
                Service Name
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="2" color={ROSE_PASTEL}>
                Client ID Client Code
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="2" color={ROSE_PASTEL}>
                Facility Name
              </ColorHeaderCell>
              <ColorHeaderCell colSpan="3" color={ROSE_PASTEL}>
                Date of referral
              </ColorHeaderCell>
              <ColorHeaderCell rowSpan="2" color={GREY_PASTEL}>
                NEW Case
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} colSpan="3">
                Date of verification
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} rowSpan="2">
                Month
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} rowSpan="2">
                Year
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} rowSpan="2">
                Date
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} rowSpan="2">
                Month
              </ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL} rowSpan="2">
                Year
              </ColorHeaderCell>
            </Table.Row>
            <Table.Row>
              <ColorHeaderCell color={BLUE_PASTEL}>Date</ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL}>Month</ColorHeaderCell>
              <ColorHeaderCell color={BLUE_PASTEL}>Year</ColorHeaderCell>
              <ColorHeaderCell color={ROSE_PASTEL}>Date</ColorHeaderCell>
              <ColorHeaderCell color={ROSE_PASTEL}>Month</ColorHeaderCell>
              <ColorHeaderCell color={ROSE_PASTEL}>Year</ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL}>Date</ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL}>Month</ColorHeaderCell>
              <ColorHeaderCell color={GREY_PASTEL}>Year</ColorHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((e, i) => (
              <Table.Row key={e.id}>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>
                  {locations.find((p) => p.value === e.psnu)?.label ?? ''}
                </Table.Cell>
                <Table.Cell>{e.moPName}</Table.Cell>
                <Table.Cell>{e.cboName}</Table.Cell>
                <Table.Cell>{e.supporterName}</Table.Cell>
                <Table.Cell>{e.reachCode}</Table.Cell>
                <ColorCell color={BLUE_PASTEL}>{e.layTestingCode}</ColorCell>
                <ColorCell color={BLUE_PASTEL}>{e.htcTestCode}</ColorCell>
                <ColorCell color={BLUE_PASTEL}>{e.htcSite}</ColorCell>
                <ColorCell color={BLUE_PASTEL}>
                  {toDay(e.dateOfTesting)}
                </ColorCell>
                <ColorCell color={BLUE_PASTEL}>
                  {toMonth(e.dateOfTesting)}
                </ColorCell>
                <ColorCell color={BLUE_PASTEL}>
                  {toYear(e.dateOfTesting)}
                </ColorCell>
                <ColorCell color={BLUE_PASTEL}>{e.testResult}</ColorCell>
                <ColorCell color={ROSE_PASTEL}>{e.serviceName}</ColorCell>
                <ColorCell color={ROSE_PASTEL}>{e.clientID}</ColorCell>
                <ColorCell color={ROSE_PASTEL}>{e.facilityName}</ColorCell>
                <ColorCell color={ROSE_PASTEL}>
                  {toDay(e.dateOfReferral)}
                </ColorCell>
                <ColorCell color={ROSE_PASTEL}>
                  {toMonth(e.dateOfReferral)}
                </ColorCell>
                <ColorCell color={ROSE_PASTEL}>
                  {toYear(e.dateOfReferral)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>{e.referralSlip}</ColorCell>
                <ColorCell color={GREY_PASTEL}>{e.newCase}</ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toDay(e.dateOfVerification)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toMonth(e.dateOfVerification)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toYear(e.dateOfVerification)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toMonth(e.reportingPeriod)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toYear(e.reportingPeriod)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toDay(e.updatedDate)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toMonth(e.updatedDate)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>
                  {toYear(e.updatedDate)}
                </ColorCell>
                <ColorCell color={GREY_PASTEL}>{e.note}</ColorCell>
              </Table.Row>
            ))}
          </Table.Body>
          <Pagination
            sticky
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={pageCount}
            totalCount={data.length}
            gotoPage={setPageIndex}
            setPageSize={setPageSize}
          />
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default PersonalDataHistoryTable;
