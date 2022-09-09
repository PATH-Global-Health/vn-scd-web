import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Button, Dropdown, Icon, Select, Pagination } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import { LayTestUpdate, TestingHistory } from '../../../../models/customer';
import DataTable, { Column } from '@app/components/data-table';
import CreateLayTestModal from '../../../formTesting/CreateLayTestModal';
import CreateRecencyModal from '../../../formTesting/CreateRecencyModal';
import CreateCD4Modal from '../../../formTesting/CreateCD4Modal';
import CreateViralLoadModal from '../../../formTesting/CreateViralLoadModal';
import CreateHTSPostModal from '../../../formTesting/CreateHTSPostModal';

import {
  getTestingHistory,
  setReferFormType,
} from '../../../../slices/customer';
import ReferModal from '../../../ReferModal';
import { getReferHospitals } from '@admin/manage-account/slices/hospital';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';
import TestingPaneDetail from './TestingPaneDetail';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { FaUserMd } from 'react-icons/fa';

const TestingPane: React.FC = () => {
  const { t } = useTranslation();

  const formTypeFilter = [
    {
      key: 'ALL',
      text: t('All'),
      value: 0,
    },
    {
      key: 'LAY_TEST',
      text: t('Lay test'),
      value: 1,
    },
    {
      key: 'VIRAL_LOAD',
      text: t('Viral load test'),
      value: 2,
    },
    {
      key: 'CD4',
      text: t('CD4 test'),
      value: 3,
    },
    {
      key: 'HTS_POS',
      text: t('Confirmatory test'),
      value: 5,
    },
    {
      key: 'RECENCY',
      text: t('Recency test'),
      value: 4,
    },
  ];
  const dispatch = useDispatch();
  const [referModal, setReferModal] = useState(false);
  const { customer } = useSelector((c) => c.admin.customer.customer);
  const [formType, setFormType] = useState(0);
  const [formTypeProps, setFormTypeProps] = useState(0);
  const [activePage, setActivePage] = useState<string>('1');
  const [testingData, setTestingData] = useState<TestingHistory>();
  const [layTestUpdate, setLayTestUpdate] = useState<LayTestUpdate>();

  const { testingHistory } = useSelector((t) => t.admin.customer.customer);
  const testingHistoryData = [] as TestingHistory[];
  testingHistory?.data
    .filter((t) => t.isDelete === false)
    .map((ts) =>
      testingHistoryData.push({
        id: ts.id,
        dateCreate: '',
        dateUpdate: '',
        employeeName: ts.cdO_Employee.name,
        type: ts.result.type,
        hivPublicExaminationDate: ts.result.hivPublicExaminationDate,
        publicExaminationOrder: ts.result.publicExaminationOrder,
        examinationForm: ts.result.examinationForm,
        receptionId: ts.result.receptionId,
        takenDate: ts.result.takenDate,
        testingDate: ts.result.testingDate,
        resultDate: ts.result.resultDate,
        resultTesting: ts.result.resultTesting,
        viralLoad: ts.result.viralLoad,
        code: ts.result.code,
        employeeId: ts.cdO_Employee.employeeId,
      }),
    );

  const getData = useCallback(() => {
    dispatch(
      getTestingHistory({
        customerId: customer?.id!,
        pageIndex: Number.parseInt(activePage),
        pageSize: 10,
      }),
    );
  }, [activePage, customer, dispatch]);

  useEffect(getData, [getData]);

  const columnTestings: Column<TestingHistory>[] = useMemo(
    (): Column<TestingHistory>[] => [
      {
        header: t(''),
        accessor: 'id',
        render: (d): JSX.Element =>
          Boolean(d.employeeId) ? <FaUserMd color="#344955" /> : <></>,
      },
      {
        header: t('Type'),
        accessor: 'type',
        render: (d): string =>
          d.type === 1
            ? t('Lay test')
            : d.type === 2
            ? t('Viral load test')
            : d.type === 3
            ? t('CD4 test')
            : d.type === 4
            ? t('Recency test')
            : t('Confirmatory test'),
      },
      {
        header: t('No.'),
        accessor: 'publicExaminationOrder',
      },
      {
        header: t('Service Form'),
        accessor: 'examinationForm',
        render: (d): string =>
          d.examinationForm === 0
            ? 'CB0 làm xét nghiệm cho khách hàng'
            : d.examinationForm === 1
            ? 'Khách hàng tự xét nghiệm có hỗ trợ'
            : d.examinationForm === 2
            ? 'Khách hàng tự xét nghiệm không hỗ trợ'
            : '',
      },
      {
        header: t('Code'),
        accessor: 'code',
      },
      {
        header: t('Staff'),
        accessor: 'employeeName',
      },
      {
        header: t('Result'),
        accessor: 'resultTesting',
      },
      {
        header: t('Result date'),
        accessor: 'resultDate',
        render: (d): string =>
          Boolean(d.resultDate)
            ? moment(d.resultDate).format('DD-MM-YYYY')
            : '',
      },
    ],
    [t],
  );

  return (
    <>
      <>
        <div
          style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Select
            placeholder={t('Search by test type')}
            options={formTypeFilter}
            onChange={(e: any, d: any) => setFormType(d.value)}
          />
          <div>
            <Button
              icon
              labelPosition="left"
              primary
              onClick={async () => {
                setReferModal(true);
                await dispatch(getUnitTypes());
                await dispatch(
                  getReferHospitals({
                    isARTFacility: false,
                    isPrEPFacility: false,
                    isTestingFacility: true,
                    pageIndex: 1,
                    pageSize: 1000000000,
                  }),
                );
                await dispatch(setReferFormType(0));
              }}
            >
              <Icon name="arrow alternate circle right"></Icon>
              {t('Transfer')}
            </Button>

            <Dropdown
              text={t('Testing form')}
              icon="wpforms"
              floating
              labeled
              button
              className="icon"
              options={formTypeFilter}
              value={formTypeProps}
              onChange={(e, data: any) => {
                setFormTypeProps(data.value);
              }}
            ></Dropdown>
          </div>
        </div>

        <DataTable
          columns={columnTestings}
          data={
            formType === 0
              ? testingHistoryData
              : formType === 1
              ? testingHistoryData.filter((t) => t.type === 1)
              : formType === 2
              ? testingHistoryData.filter((t) => t.type === 2)
              : formType === 3
              ? testingHistoryData.filter((t) => t.type === 3)
              : formType === 4
              ? testingHistoryData.filter((t) => t.type === 4)
              : testingHistoryData.filter((t) => t.type === 5)
          }
          // rowActions={[
          //     {
          //         icon: <FiEdit3 />,
          //         title: 'Sửa',
          //         color: 'violet',
          //         onClick: (r): void => {
          //         },
          //     },
          //     {
          //         icon: <FiTrash2 />,
          //         title: 'Xoá',
          //         color: 'red',
          //         onClick: (r): void => {
          //         },
          //     },
          // ]}
          noPaging
          onRowClick={(row): void => {
            if (row.employeeId && row.type === 5) {
              setLayTestUpdate({
                id: row.id,
                employeeId: row.employeeId,
                resultTesting: row.resultTesting,
                takenDate: row.takenDate,
                code: row.code,
              });
              return setFormTypeProps(5);
            }
            setTestingData(row);
          }}
        ></DataTable>
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={testingHistory?.totalPage!}
          onPageChange={(e, { activePage }) => setActivePage(activePage + '')}
          pointing
          secondary
        />
      </>

      <CreateLayTestModal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreateRecencyModal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreateCD4Modal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreateViralLoadModal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreateHTSPostModal
        layTestUpdate={layTestUpdate}
        data={customer!}
        formType={formTypeProps}
        onClose={() => {
          setLayTestUpdate(undefined);
          setFormTypeProps(0);
        }}
      />

      <ReferModal
        open={referModal}
        data={customer!}
        // formType={formTypeProps}
        // onRefresh={}
        onClose={() => setReferModal(false)}
      />

      <TestingPaneDetail
        data={testingData!}
        info={customer!}
        onClose={(): void => setTestingData(undefined)}
      ></TestingPaneDetail>
    </>
  );
};

export default TestingPane;
