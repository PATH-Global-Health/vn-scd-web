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

import { getServiceForms } from './service-form.slice';
import serviceFormService from './service-form.service';
import { ServiceForm } from './service-form.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<ServiceForm>[] = [{ accessor: 'name', header: 'Tên ' }];

const ServiceFormsPage: React.FC = () => {
  const serviceFormList = useSelector(
    (state) => state.csyt.catalog.serviceForm.serviceFormList,
  );
  const getServiceFormsLoading = useSelector(
    (state) => state.csyt.catalog.serviceForm.getServiceFormsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getServiceForms());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<ServiceForm>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getServiceFormsLoading;
  return (
    <>
      <DataTable
        title="Loại hình dịch vụ"
        loading={loading}
        columns={columns}
        data={serviceFormList}
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
                  await fetch(serviceFormService.deleteServiceForm(r.id));
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

export default ServiceFormsPage;
