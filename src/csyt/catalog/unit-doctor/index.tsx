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

import { getUnitDoctors } from './unit-doctor.slice';
import unitDoctorService from './unit-doctor.service';
import { UnitDoctor } from './unit-doctor.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<UnitDoctor>[] = [{ accessor: 'name', header: 'Tên ' }];

const UnitDoctorsPage: React.FC = () => {
  const unitDoctorList = useSelector(
    (state) => state.csyt.catalog.unitDoctor.unitDoctorList,
  );
  const getUnitDoctorsLoading = useSelector(
    (state) => state.csyt.catalog.unitDoctor.getUnitDoctorsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getUnitDoctors());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<UnitDoctor>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getUnitDoctorsLoading;
  return (
    <>
      <DataTable
        title="Loại hình dịch vụ"
        loading={loading}
        columns={columns}
        data={unitDoctorList}
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
                  await fetch(unitDoctorService.deleteUnitDoctor(r.id));
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

export default UnitDoctorsPage;
