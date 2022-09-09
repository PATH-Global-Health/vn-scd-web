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

import { getInjectionObjects } from './injection-object.slice';
import injectionObjectService from './injection-object.service';
import { InjectionObject } from './injection-object.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<InjectionObject>[] = [
  { accessor: 'name', header: 'Tên ' },
  { accessor: 'fromDaysOld', header: 'Từ (Ngày tuổi) ' },
  { accessor: 'toDaysOld', header: 'Tới (Ngày tuổi) ' },
];

const InjectionObjectsPage: React.FC = () => {
  const injectionObjectList = useSelector(
    (state) => state.csyt.catalog.injectionObject.injectionObjectList,
  );
  const getInjectionObjectsLoading = useSelector(
    (state) => state.csyt.catalog.injectionObject.getInjectionObjectsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getInjectionObjects());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<InjectionObject>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getInjectionObjectsLoading;
  return (
    <>
      <DataTable
        title="Loại hình dịch vụ"
        loading={loading}
        columns={columns}
        data={injectionObjectList}
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
                  await fetch(
                    injectionObjectService.deleteInjectionObject(r.id),
                  );
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

export default InjectionObjectsPage;
