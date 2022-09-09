import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import DataTable, { Column } from '@app/components/data-table';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';

import { unitTypeService } from '../services';
import { UnitType } from '../models/unit-type';

import CreateUpdateModal from '../components/unit-type/CreateUpdateModal';
import { getUnitTypes } from '../slices/unit-type';

const columns: Column<UnitType>[] = [
  {
    header: 'Mã',
    accessor: 'code',
  },
  {
    header: 'Tên',
    accessor: 'typeName',
  },
  {
    header: 'Miêu tả',
    accessor: 'description',
  },
];

const UnitTypesPage: React.FC = () => {
  const { fetch, fetching } = useFetchApi();
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getUnitTypes());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_ACCOUNT,
    ComponentKey.ADMIN_UNIT_TYPES,
    getData,
  );
  useEffect(getData, [getData]);

  const confirm = useConfirm();

  const [openCreateUpdate, setOpenCreateUpdate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<UnitType>();

  return (
    <>
      <DataTable
        search
        title="Loại hình đơn vị"
        loading={getUnitTypesLoading || fetching}
        columns={columns}
        data={unitTypeList}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Thêm',
            onClick: (): void => {
              setOpenCreateUpdate(true);
            },
          },
        ]}
        rowActions={[
          {
            icon: <FiEdit3 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (d): void => {
              setOpenCreateUpdate(true);
              setUpdateDetails(d);
            },
          },
          {
            icon: <FiTrash2 />,
            title: 'Xoá',
            color: 'red',
            onClick: (d): void => {
              confirm('Xác nhận xoá', async () => {
                await fetch(unitTypeService.deleteUnitType(d.id));
                getData();
              });
            },
          },
        ]}
      />

      <CreateUpdateModal
        open={openCreateUpdate}
        onClose={(): void => {
          setOpenCreateUpdate(false);
          setUpdateDetails(undefined);
        }}
        onRefresh={(): void => getData()}
        defaultValues={updateDetails}
      />
    </>
  );
};

export default UnitTypesPage;
