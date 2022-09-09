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

import { getUnitTypes } from './unit-type.slice';
import unitTypeService from './unit-type.service';
import { UnitType } from './unit-type.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<UnitType>[] = [{ accessor: 'typeName', header: 'Tên ' }];

const UnitTypesPage: React.FC = () => {
  const unitTypeList = useSelector(
    (state) => state.csyt.catalog.unitType.unitTypeList,
  );
  const getUnitTypesLoading = useSelector(
    (state) => state.csyt.catalog.unitType.getUnitTypesLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getUnitTypes());
  }, [dispatch]);
  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_SERVICE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<UnitType>();

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const loading = fetching || getUnitTypesLoading;
  return (
    <>
      <DataTable
        title="Loại cơ sở"
        loading={loading}
        columns={columns}
        data={unitTypeList}
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
                  await fetch(unitTypeService.deleteUnitType(r.id));
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

export default UnitTypesPage;
