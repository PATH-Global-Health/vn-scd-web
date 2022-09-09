import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import {
  Table,
  Header,
  Dimmer,
  Loader,
  SemanticCOLORS,
  Modal,
} from 'semantic-ui-react';

import { FiEdit3, FiTrash2, FiClock } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch, useConfirm, useAuth } from '@app/hooks';
import {
  getPatientInfos,
  deletePatientInfo,
  updatePatientInfo,
} from '@smd/redux/patient-info';
import { PatientInfo } from '@smd/models';
import { unwrapResult } from '@reduxjs/toolkit';
import { getProjectByToken, getProjects } from '@smd/redux/project';
import { getCBOs, getCBOsByToken, getInfo } from '@smd/redux/cbo';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import Action from '@app/components/data-table/Action';
import Pagination from '@app/components/data-table/Pagination';

import locations from '@app/assets/mock/locations.json';
import { toDay, toMonth, toYear } from '@app/utils/helpers';

import PersonalDataFilter from './personal-data-filter';

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
const ActionsWrapper = styled.div`
  margin-left: auto;
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
  onSelect: (d: PatientInfo) => void;
}

const PersonalDataTable: React.FC<Props> = ({ onSelect }) => {
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAdmin, isProject, isCBO } = useAuth();

  const [filter, setFilter] = useState<object>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selecting, setSelecting] = useState<PatientInfo>();

  const { data, pageCount } = useSelector(
    (s) => s.smd.patientInfo.patientInfoData,
  );
  const getLoading = useSelector(
    (s) => s.smd.patientInfo.getPatientInfosLoading,
  );
  const deleteLoading = useSelector(
    (s) => s.smd.patientInfo.deletePatientInfoLoading,
  );
  const updateLoading = useSelector(
    (s) => s.smd.patientInfo.updatePatientInfoLoading,
  );

  const getData = useCallback(() => {
    dispatch(getPatientInfos({ ...filter, pageSize, pageIndex }));
  }, [dispatch, filter, pageSize, pageIndex]);
  useEffect(getData, [getData]);

  const rowActions = [
    {
      title: t('History'),
      icon: <FiClock />,
      color: 'black',
      onClick: onSelect,
    },
    {
      title: t('Edit'),
      icon: <FiEdit3 />,
      color: 'violet',
      onClick: (d: PatientInfo) => setSelecting(d),
      hidden: isAdmin,
    },
    {
      title: t('Delete'),
      icon: <FiTrash2 />,
      color: 'red',
      onClick: ({ id }: PatientInfo) => {
        confirm(t('Confirm delete ?'), async () => {
          await dispatch(deletePatientInfo(id));
          getData();
        });
      },
      hidden: isAdmin,
    },
  ];

  useEffect(() => {
    const arg = { pageSize: 1000, pageIndex: 0 };
    dispatch(getProjects(arg));
    dispatch(getCBOs({ ...arg, isGetAll: true }));
    if (isProject) {
      dispatch(getProjectByToken());
      dispatch(getCBOsByToken({ pageIndex: 0, pageSize: 1000 }));
    } else {
      dispatch(getInfo());
    }
  }, [dispatch, isProject]);
  const projectInfo = useSelector((s) => s.smd.project.projectInfo);
  const cboInfo = useSelector((s) => s.smd.cbo.cboInfo);
  const { data: cboOptions } = useSelector((s) => s.smd.cbo.cboData);
  const renderCBOOptions = useCallback(() => {
    if (isProject && projectInfo) {
      return cboOptions
        .filter((c) => c.projectId === projectInfo?.id ?? '')
        .map((c) => ({
          key: c.id,
          province: c.province,
          text: c.name,
          value: c?.code,
        }));
    }
    if (isCBO && cboInfo) {
      return [cboInfo].map((c) => ({
        key: c?.id,
        text: c?.name,
        value: c?.code,
      }));
    }
    return cboOptions.map((c) => ({
      key: c.id,
      text: c.name,
      value: c?.code,
    }));
  }, [cboOptions, projectInfo, isCBO, isProject, cboInfo]);

  const fields = useMemo(
    (): FormField<PatientInfo>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'psnu',
        type: 'select',
        options: locations.map((p) => ({ text: p.label, value: p.value })),
        label: t('Province/City'),
      },
      {
        name: 'cboCode',
        type: 'select',
        options: renderCBOOptions(),
        label: t('CBO'),
      },
      {
        name: 'supporterName',
        label: 'MEDHANNISM OR PARTNER NAME',
      },
      {
        name: 'reachCode',
        label: 'Reach Code',
      },
      {
        name: 'layTestingCode',
        label: 'Lay-testing code',
      },
      {
        name: 'htcTestCode',
        label: 'HTC test code',
      },
      {
        name: 'htcSite',
        label: 'HTC site',
      },
      {
        inputType: 'date',
        name: 'dateOfTesting',
        label: 'Date of testing',
      },
      {
        name: 'testResult',
        label: 'Test result',
        type: 'select',
        options: [
          { text: t('Positive'), value: 'POSITIVE' },
          { text: t('Negative'), value: 'NEGATIVE' },
        ],
      },
      {
        name: 'serviceName',
        label: 'Service Name',
      },
      {
        name: 'clientID',
        label: 'Client ID Client Code',
      },
      {
        name: 'facilityName',
        label: 'Facility Name',
      },
      {
        inputType: 'date',
        name: 'dateOfReferral',
        label: 'Date of referral',
      },
      {
        name: 'referralSlip',
        label: 'Referral slips certified by Facilities',
      },
      {
        type: 'select',
        name: 'newCase',
        label: 'NEW Case',
        options: ['Yes', 'No', 'Pending'].map((e) => ({ text: e, value: e })),
      },
      {
        inputType: 'date',
        name: 'dateOfVerification',
        label: 'Date of verification',
      },
      {
        inputType: 'date',
        name: 'reportingPeriod',
        label: 'Reporting Period',
      },
      {
        inputType: 'date',
        name: 'updatedDate',
        label: 'Updated Date',
      },
      {
        name: 'note',
        label: 'Note',
      },
    ],
    [t, renderCBOOptions],
  );

  return (
    <Wrapper>
      <Dimmer inverted active={getLoading || deleteLoading}>
        <Loader />
      </Dimmer>
      <PersonalDataFilter onChange={setFilter} />
      <ToolbarWrapper>
        <TableHeader content={t('Individual data management').toString()} />
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
              {!isAdmin && <ColorHeaderCell rowSpan="3" />}
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
                <Table.Cell>
                  <ActionsWrapper>
                    {rowActions.map((a) => (
                      <Action
                        key={`${a.title}|${a.color ?? 'rainbow'}`}
                        data={e}
                        icon={a.icon}
                        color={a.color as SemanticCOLORS}
                        title={a.title}
                        onClick={a.onClick}
                        hidden={a.hidden}
                      />
                    ))}
                  </ActionsWrapper>
                </Table.Cell>
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

      <Modal open={Boolean(selecting)} onClose={() => setSelecting(undefined)}>
        <Modal.Header>{t('Edit')}</Modal.Header>
        <Modal.Content>
          <SimpleForm
            loading={updateLoading}
            defaultValues={selecting}
            formFields={fields}
            onSubmit={async (d) => {
              unwrapResult(await dispatch(updatePatientInfo(d)));

              setSelecting(undefined);
              getData();
            }}
          />
        </Modal.Content>
      </Modal>
    </Wrapper>
  );
};

export default PersonalDataTable;
