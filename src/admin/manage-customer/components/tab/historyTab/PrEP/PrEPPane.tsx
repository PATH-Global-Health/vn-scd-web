import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';

import { PrEPHistory, PrEPUpdateHistory } from '../../../../models/customer';
import moment from 'moment';
//----------------------------------------------------------------------------
import DataTable, { Column } from '@app/components/data-table';
import CreateTXMLFormModal from '../../../formPrEP/CreateTX_ML_FormModal';
import CreatePrEPFormModal from '../../../formPrEP/CreatePrEPFormModal';
import { setReferFormType } from '../../../../slices/customer';
import ReferModal from '../../../ReferModal';
import { getReferHospitals } from '@admin/manage-account/slices/hospital';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';
import { useTranslation } from 'react-i18next';
import { FaUserMd } from 'react-icons/fa';
//----------------------------------------------------------------------------

const PrEPPane: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const formTypePrEP = [
    {
      key: 'All',
      text: t('All'),
      value: 0,
    },
    {
      key: 'PrEP_FORM',
      text: t('Receive treatment'),
      value: 6,
    },
    {
      key: 'TX_ML_FORM',
      text: t('Update information on stopping treatment'),
      value: 7,
    },
  ];

  const [referModal, setReferModal] = useState(false);
  const { customer } = useSelector((c) => c.admin.customer.customer);
  const [formTypeProps, setFormTypeProps] = useState(0);
  const [prEPHistoryUpdate, setPrEPHistoryUpdate] = useState<
    PrEPUpdateHistory
  >();

  //-----------------------------------------------------------------------------

  const { prEPHistory } = useSelector((t) => t.admin.customer.customer);
  const prEPHistoryData = [] as PrEPHistory[];
  prEPHistory
    .filter((p) => p.isDelete === false)
    .map((pr) =>
      prEPHistoryData.push({
        code: pr.prEP_Infomation?.code,
        isLate: pr.tX_ML?.[0]?.isLate!,
        reportDate: pr.tX_ML?.[0]?.reportDate!,
        startDate: pr.prEP_Infomation?.startDate!,
        status: pr.tX_ML?.[0]?.status!,
        timingLate: pr.tX_ML?.[0]?.timingLate!,
        id: pr.id,
        isDelete: pr.isDelete,
        cdO_Employee: pr.cdO_Employee,
      }),
    );
  const columnPrEPs: Column<PrEPHistory>[] = useMemo(
    (): Column<PrEPHistory>[] => [
      {
        header: t(''),
        accessor: 'id',
        render: (d): JSX.Element =>
          Boolean(d.cdO_Employee?.employeeId) ? (
            <FaUserMd color="#344955" />
          ) : (
            <></>
          ),
      },
      {
        header: t('Reception date'),
        accessor: 'startDate',
        render: (d): string => moment(d.startDate).format('YYYY-MM-DD'),
      },
      {
        header: t('Code'),
        accessor: 'code',
      },
      {
        header: t('The earliest time of the reporting period'),
        accessor: 'reportDate',
        render: (d): string =>
          d.reportDate ? moment(d.reportDate).format('YYYY-MM-DD') : '',
      },
      {
        header: t('Timing late'),
        accessor: 'timingLate',
      },
      {
        header: t('Status'),
        accessor: 'status',
      },
      {
        header: t('Missed'),
        accessor: 'isLate',
        render: (d): string =>
          d.isLate === 1 ? t('Yes') : d.isLate === 0 ? t('No') : '',
      },
    ],
    [t],
  );

  //-----------------------------------------------------------------------------

  return (
    <>
      <div
        style={{
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Dropdown
          text={t('PrEP treatment form')}
          icon="wpforms"
          floating
          labeled
          button
          className="icon"
          options={formTypePrEP}
          value={formTypeProps}
          onChange={(e, data: any) => {
            setFormTypeProps(data.value);
          }}
        ></Dropdown>
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
                isPrEPFacility: true,
                isTestingFacility: false,
                pageIndex: 1,
                pageSize: 1000000000,
              }),
            );
            await dispatch(setReferFormType(1));
          }}
        >
          <Icon name="arrow alternate circle right"></Icon>
          {t('Transfer')}
        </Button>
      </div>
      <DataTable
        columns={columnPrEPs}
        data={prEPHistoryData}
        onRowClick={(row): void => {
          if (row.cdO_Employee?.employeeId) {
            setPrEPHistoryUpdate({
              id: row.id,
              code: row.code,
              isDelete: false,
              startDate: row.startDate,
              employeeId: row.cdO_Employee.employeeId,
            });
            return setFormTypeProps(6);
          }
        }}

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
      ></DataTable>

      <CreateTXMLFormModal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreatePrEPFormModal
        prEPUpdateHistory={prEPHistoryUpdate}
        data={customer!}
        formType={formTypeProps}
        onClose={() => {
          setPrEPHistoryUpdate(undefined);
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
    </>
  );
};

export default PrEPPane;
