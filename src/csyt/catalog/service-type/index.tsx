import React, { useEffect, useCallback, useState } from 'react';
import { FiCheck, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useConfirm,
  useFetchApi,
} from '@app/hooks';

import { getServiceTypes } from './service-type.slice';
import serviceTypeService from './service-type.service';
import { ServiceType } from './service-type.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<ServiceType>[] = [
  // { accessor: 'Code', header: 'Mã' },
  { accessor: 'description', header: 'Loại hình' },
  {
    accessor: 'canChooseDoctor',
    header: 'Được chọn bác sĩ',
    render: (d): React.ReactNode => d.canChooseDoctor && <FiCheck />,
  },
  {
    accessor: 'canChooseHour',
    header: 'Được chọn giờ',
    render: (d): React.ReactNode => d.canChooseHour && <FiCheck />,
  },
  {
    accessor: 'canUseHealthInsurance',
    header: 'Sử dụng BHYT',
    render: (d): React.ReactNode => d.canUseHealthInsurance && <FiCheck />,
  },
  {
    accessor: 'canPostPay',
    header: 'Thanh toán sau',
    render: (d): React.ReactNode => d.canPostPay && <FiCheck />,
  },
];

const ServiceTypesPage: React.FC = () => {
  const serviceTypeList = useSelector(
    (state) => state.csyt.catalog.serviceType.serviceTypeList,
  );
  const getServiceTypesLoading = useSelector(
    (state) => state.csyt.catalog.serviceType.getServiceTypesLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getServiceTypes());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<ServiceType>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getServiceTypesLoading;
  return (
    <>
      <DataTable
        title="Loại hình dịch vụ"
        loading={loading}
        columns={columns}
        data={serviceTypeList}
        tableActions={[
          {
            icon: <FiPlus />,
            title: 'Tạo',
            color: 'green',
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        rowActions={[
          {
            icon: <FiEdit2 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (r): void => setUpdateDetails(r),
          },
          {
            icon: <FiTrash2 />,
            title: 'Xoá',
            color: 'red',
            onClick: (r): void => {
              confirm(
                'Xác nhận xoá',
                async (): Promise<void> => {
                  await fetch(serviceTypeService.deleteServiceType(r.id));
                  getData();
                },
              );
            },
          },
        ]}
      />

      <CreateModal
        open={openCreate}
        onClose={(): void => setOpenCreate(false)}
        onRefresh={getData}
      />

      <UpdateModal
        data={updateDetails}
        onClose={(): void => setUpdateDetails(undefined)}
        onRefresh={getData}
      />
    </>
  );
};

export default ServiceTypesPage;
