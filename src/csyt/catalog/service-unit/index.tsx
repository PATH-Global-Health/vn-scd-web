import React, { useEffect, useCallback, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useConfirm,
  useFetchApi,
} from '@app/hooks';

import { getServiceUnits } from './service-unit.slice';
import serviceUnitService from './service-unit.service';
import { ServiceUnit } from './service-unit.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<ServiceUnit>[] = [{ accessor: 'name', header: 'Tên ' }];

const ServiceUnitsPage: React.FC = () => {
  const serviceUnitList = useSelector(
    (state) => state.csyt.catalog.serviceUnit.serviceUnitList,
  );
  const getServiceUnitsLoading = useSelector(
    (state) => state.csyt.catalog.serviceUnit.getServiceUnitsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getServiceUnits());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<ServiceUnit>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getServiceUnitsLoading;
  return (
    <>
      <DataTable
        title="Loại hình dịch vụ"
        loading={loading}
        columns={columns}
        data={serviceUnitList}
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
                  await fetch(serviceUnitService.deleteServiceUnit(r.id));
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

export default ServiceUnitsPage;
