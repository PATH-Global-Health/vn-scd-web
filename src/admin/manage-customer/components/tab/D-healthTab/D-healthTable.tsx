import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  useSelector,
  useDispatch,
} from '@app/hooks';
import DataTable, { Column } from '@app/components/data-table';
import { Customer } from '@admin/manage-customer/models/customer';
import { getARTHistory, getCustomersByDhealth, getPrEPHistory, getTestingHistory, setCustomer } from '../../../slices/customer';
import { useTranslation } from 'react-i18next';
import HistoryModal from '../../HistoryModal';
import { ImHistory } from 'react-icons/im';

const DhealthTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getCustomersByDhealth());
  }, [dispatch]);

  useEffect(getData, [getData]);

  const { customerListByDhealth, getCustomersLoading} = useSelector(
    (state) => state.admin.customer.customer,
  );

  const [historyModal, setHistoryModal] = useState(false);
  const [selecting, setSelecting] = useState<Customer>();

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
        customerListByDhealth.find((i) => i.id === c.id)?.gender === false ? t('Female') : t('Male')
      },
      {
        header: t('Identity card'),
        accessor: 'identityCard',
      },
    ],
    [customerListByDhealth, t],
  );

  const loading = getCustomersLoading;


  return <>
    <DataTable
      search
      loading={loading}
      columns={columns}
      data={customerListByDhealth}
      rowActions={[
        {
          icon: <ImHistory />,
          title: t('Treatment history'),
          color: 'teal',
          onClick: (r): void => {
            setHistoryModal(true);
            setSelecting(r);
            dispatch(setCustomer(r));
            dispatch(getTestingHistory({ customerId: r.id, pageIndex: 1, pageSize: 10 }));
            dispatch(getPrEPHistory(r.id));
            dispatch(getARTHistory(r.id));
          }
        },
        
      ]}
    >
    </DataTable>

    <HistoryModal
      open={historyModal}
      onClose={(): void => setHistoryModal(false)}
      data={selecting}
      onRefresh={getData}
    />
  </>
}

export default DhealthTable;