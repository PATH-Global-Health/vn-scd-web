import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useSelector, useDispatch, useConfirm } from '@app/hooks';
import DataTable, { Column } from '@app/components/data-table';
import { Customer } from '@admin/manage-customer/models/customer';
import {
  getARTHistory,
  getCustomers,
  getPrEPHistory,
  getTestingHistory,
  setCustomer,
} from '../../../slices/customer';
import { useTranslation } from 'react-i18next';
import HistoryModal from '../../HistoryModal';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateModal from '../../../components/CreateModal';
import customerService from '../../../services/customer';
import { ImHistory } from 'react-icons/im';

const ManagingTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { customerList, getCustomersLoading, selectedHospital } = useSelector(
    (state) => state.admin.customer.customer,
  );

  const getData = useCallback(() => {
    dispatch(getCustomers(selectedHospital?.id!));
  }, [dispatch, selectedHospital]);

  useEffect(getData, [getData]);

  // const {
  //   selectedHospital,
  // } = useSelector((state) => state.csyt.workingSchedule);

  const customerListSuccess = customerList.filter((c) => c.isDeleted === false);

  const [historyModal, setHistoryModal] = useState(false);
  const [selecting, setSelecting] = useState<Customer>();
  const [createModal, setCreateModal] = useState(false);

  const columns: Column<Customer>[] = useMemo(
    (): Column<Customer>[] => [
      {
        header: t('Phone number'),
        accessor: 'phoneNumber',
      },
      {
        header: t('Name'),
        accessor: 'fullname',
      },
      {
        header: t('Gender'),
        accessor: 'gender',
        render: (c): string =>
          customerListSuccess.find((i) => i.id === c.id)?.gender === false
            ? t('Female')
            : t('Male'),
      },
      {
        header: t('Identity card'),
        accessor: 'identityCard',
      },
    ],
    [customerListSuccess, t],
  );

  const loading = getCustomersLoading;

  return (
    <>
      <DataTable
        search
        loading={loading}
        columns={columns}
        data={customerListSuccess}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: t('Add'),
            onClick: (): void => {
              setCreateModal(true);
            },
          },
        ]}
        rowActions={[
          {
            icon: <ImHistory />,
            title: t('Treatment history'),
            color: 'teal',
            onClick: (r): void => {
              setHistoryModal(true);
              setSelecting(r);
              dispatch(setCustomer(r));
              dispatch(
                getTestingHistory({
                  customerId: r.id,
                  pageIndex: 1,
                  pageSize: 10,
                }),
              );
              dispatch(getPrEPHistory(r.id));
              dispatch(getARTHistory(r.id));
            },
          },
          {
            icon: <FiTrash2 />,
            title: t('Delete'),
            color: 'red',
            onClick: (r): void => {
              confirm(t('Confirm delete ?'), async () => {
                await customerService.deleteCustomer(r.id);
                getData();
              });
            },
          },
        ]}
      ></DataTable>

      <CreateModal
        data={selectedHospital?.id!}
        open={createModal}
        onClose={(): void => setCreateModal(false)}
        onRefresh={getData}
      />

      <HistoryModal
        open={historyModal}
        onClose={(): void => setHistoryModal(false)}
        data={selecting}
        onRefresh={getData}
      />
    </>
  );
};

export default ManagingTable;
