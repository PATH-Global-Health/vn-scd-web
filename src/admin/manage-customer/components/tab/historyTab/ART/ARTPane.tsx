import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';

import { PrEPHistory, PrEPUpdateHistory } from '../../../../models/customer';
import moment from 'moment';
//----------------------------------------------------------------------------
import DataTable, { Column } from '@app/components/data-table';
import { setReferFormType } from '../../../../slices/customer';
import ReferModal from '../../../ReferModal';
import { getReferHospitals } from '@admin/manage-account/slices/hospital';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';
import CreateTXMLARTFormModal from '@admin/manage-customer/components/formPrEP/CreateTX_ML_ARTFormModal';
import CreateARTFormModal from '@admin/manage-customer/components/formPrEP/CreateARTFormModal';
import { useTranslation } from 'react-i18next';
import { FaUserMd } from 'react-icons/fa';
//----------------------------------------------------------------------------

const ARTPane: React.FC = () => {
  const { t } = useTranslation();
  const formTypeART = [
    {
      key: 'All',
      text: t('All'),
      value: 0,
    },
    {
      key: 'ART_FORM',
      text: t('Receive treatment'),
      value: 8,
    },
    {
      key: 'TX_ML_ART_FORM',
      text: t('Update information on stopping treatment'),
      value: 9,
    },
  ];
  const dispatch = useDispatch();

  const [referModal, setReferModal] = useState(false);
  const { customer } = useSelector((c) => c.admin.customer.customer);
  const [formTypeProps, setFormTypeProps] = useState(0);
  const [ARTHistoryUpdate, setARTHistoryUpdate] = useState<PrEPUpdateHistory>();

  //-----------------------------------------------------------------------------

  const { ARTHistory } = useSelector((t) => t.admin.customer.customer);
  const ARTHistoryData = [] as PrEPHistory[];
  ARTHistory.filter((p) => p.isDelete === false).map((pr) =>
    ARTHistoryData.push({
      code: pr.arT_Infomation?.code,
      isLate: pr.tX_ML?.[0]?.isLate!,
      reportDate: pr.tX_ML?.[0]?.reportDate!,
      startDate: pr.arT_Infomation?.startDate!,
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
          text={t('ART treatment form')}
          icon="wpforms"
          floating
          labeled
          button
          className="icon"
          options={formTypeART}
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
                isARTFacility: true,
                isPrEPFacility: false,
                isTestingFacility: false,
                pageIndex: 1,
                pageSize: 1000000000,
              }),
            );
            await dispatch(setReferFormType(2));
          }}
        >
          <Icon name="arrow alternate circle right"></Icon>
          {t('Transfer')}
        </Button>
      </div>
      <DataTable
        columns={columnPrEPs}
        data={ARTHistoryData}
        onRowClick={(row): void => {
          if (row.cdO_Employee?.employeeId) {
            setARTHistoryUpdate({
              id: row.id,
              code: row.code,
              isDelete: false,
              startDate: row.startDate,
              employeeId: row.cdO_Employee.employeeId,
            });
            return setFormTypeProps(8);
          }
        }}
      ></DataTable>

      <CreateTXMLARTFormModal
        data={customer!}
        formType={formTypeProps}
        onClose={() => setFormTypeProps(0)}
      />

      <CreateARTFormModal
        ARTUpdateHistory={ARTHistoryUpdate}
        data={customer!}
        formType={formTypeProps}
        onClose={() => {
          setARTHistoryUpdate(undefined);
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

export default ARTPane;
