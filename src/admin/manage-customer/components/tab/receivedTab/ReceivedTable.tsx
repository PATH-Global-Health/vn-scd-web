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
import { ReceivedCustomer } from '@admin/manage-customer/models/customer';
import { customerService } from '../../../services';
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import { List } from 'semantic-ui-react';
import moment from 'moment';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import { getReceivedCustomers } from '@admin/manage-customer/slices/customer';
import UpdateRecivedModal from './UpdateRecivedModal';
import { useTranslation } from 'react-i18next';

const ReceivedTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getCustomersLoading, referTicket, selectedHospital } = useSelector(
    (state) => state.admin.customer.customer,
  );

  const getData = useCallback(() => {
    // dispatch(getCustomers(selectedHospital?.id!));
    dispatch(getReceivedCustomers(selectedHospital?.id!));
  }, [dispatch, selectedHospital]);

  useEffect(getData, [getData]);
  


  // const {
  //   selectedHospital,
  // } = useSelector((state) => state.csyt.workingSchedule);

  const receivedCustomerList: ReceivedCustomer[] = [];

  referTicket.map(r => receivedCustomerList.push({
    ...r.profile,
    status: r.status,
    idReferTicket: r.id,
    fromUnitName: r.fromUnit?.name,
    toUnitName: r.toUnit.name,
    note: r.note,
    type: r.type,
    referDate: r.referDate,
    receivedDate: r.receivedDate,
    employeeId: r.employeeId
  }));

  const [updateRecivedModal, setUpdateRecivedModal] = useState(false);
  const [updateRecivedData, setUpdateRecivedData] = useState<ReceivedCustomer>();

  const cancelReceviedCustomer = async (data: ReceivedCustomer) => {
    try {
      await customerService.updateReceiveCustomers({ ...data, status: 2 });
      await dispatch(getReceivedCustomers(selectedHospital?.id!));
      toast(
        <ToastComponent
          content={t('Successful receive cancel')}
          type="success"
        />,
      );

    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed receive cancel')}
          type="failed"
        />,
      );

    }

  }
  const receivedColumns: Column<ReceivedCustomer>[] = useMemo(
    (): Column<ReceivedCustomer>[] => [
      {
        header: t('Customer information'),
        accessor: 'fullname',
        render: (c): any =>
          <List>
            <List.Item>
              <List.Content>
                <List.Header >{c.fullname}</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Description as='a'>{c.phoneNumber}</List.Description>
              </List.Content>
            </List.Item>
          </List>
      },
      {
        header: t('Transfer'),
        accessor: 'fromUnitName',
        render: (c): any =>
          <List>
            <List.Item>
              <List.Content>
                <List.Header >{c.fromUnitName}</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Description as='a'>{moment(c.referDate).format('YYYY-MM-DD') === '0001-01-01' ? "" : moment(c.referDate).format('YYYY-MM-DD')}</List.Description>
              </List.Content>
            </List.Item>
          </List>
      },
      {
        header: t('Receive'),
        accessor: 'toUnitName',
        render: (c): any =>
          <List>
            <List.Item>
              <List.Content>
                <List.Header >{c.toUnitName}</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Description as='a'>{moment(c.receivedDate).format('YYYY-MM-DD') === '0001-01-01' ? "" : moment(c.receivedDate).format('YYYY-MM-DD')}</List.Description>
              </List.Content>
            </List.Item>
          </List>
      },
      {
        header: t('Transfer service'),
        accessor: 'type',
        render: (c): string => c.type === 0 ? t('Testing') :
          c.type === 1 ? t('PrEP') : t('ART')
      },
      {
        header: t('Note'),
        accessor: 'note',
      },
      // {
      //   header: t('Staff'),
      //   accessor: 'employeeId',
      //   render: (c): string => doctorList.find(d => d.id === c.employeeId)?.userName!
      // },
      {
        header: t('Status'),
        accessor: 'status',
        render: (c): any =>
          c.status === 1 ? <label style={{ color: 'green', fontWeight: 'bold' }}>{t('Receive')}</label> :
            c.status === 0 ? <label style={{ fontWeight: 'bold' }}>{t('Waiting')}</label> :
              <label style={{ color: 'red', fontWeight: 'bold' }}>{t('Don\'t receive')}</label>
      },
    ],
    [t],
  );
  return <>
    <DataTable
      search
      loading={getCustomersLoading}
      columns={receivedColumns}
      data={receivedCustomerList}
      rowActions={[
        {
          icon: <AiOutlineDeliveredProcedure />,
          title: t('Receive'),
          color: 'violet',
          onClick: (r): void => {
            setUpdateRecivedData(r);
            setUpdateRecivedModal(true);

          },
        },
        {
          icon: <ImCancelCircle />,
          title: t('Don\'t receive'),
          color: 'red',
          onClick: (r): void => {
            cancelReceviedCustomer(r);
          },
        },
      ]}
    >
    </DataTable>

    {/* <CreatePrEPFormModal
      data={updateRecivedData}
      formType={updateRecivedData?.type === 1 ? 6 : 0}
      onClose={() => { setUpdateRecivedData(undefined); }}
    ></CreatePrEPFormModal>

    <CreateARTFormModal
      data={updateRecivedData}
      formType={updateRecivedData?.type === 4 ? 8 : 0}
      onClose={() => { setUpdateRecivedData(undefined); }}
    ></CreateARTFormModal>

    <CreateHTSPostModal
      data={updateRecivedData!}
      formType={updateRecivedData?.type === 0 ? 5 : 0}
      onClose={() => setUpdateRecivedData(undefined)}
    >

    </CreateHTSPostModal> */}

    <UpdateRecivedModal
      open={updateRecivedModal}
      onClose={() => setUpdateRecivedModal(false)}
      data={updateRecivedData}
      onRefresh={getData}
    ></UpdateRecivedModal>
  </>
}

export default ReceivedTable;