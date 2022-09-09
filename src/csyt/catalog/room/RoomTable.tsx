import React, { useState, useEffect, useCallback } from 'react';
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

import roomService from './room.service';
import { getRooms } from './room.slice';
import { Room } from './room.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import { useTranslation } from 'react-i18next';

const RoomTable: React.FC = () => {
  const { t } = useTranslation();

  const columns: Column<Room>[] = [
    { header: t('Code'), accessor: 'code' },
    { header: t('Name'), accessor: 'name' },
  ];
  const { selectedHospital, roomList } = useSelector(
    (state) => state.csyt.catalog.room,
  );
  const getRoomsLoading = useSelector(
    (state) => state.csyt.catalog.room.getRoomsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedHospital) {
      dispatch(getRooms(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_ROOM, getData);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Room>();

  return (
    <>
      <DataTable
        search
        columns={columns}
        data={roomList.filter((r) => r.isDeleted === false)}
        loading={getRoomsLoading || fetching}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: t('Add'),
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        rowActions={[
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: t('Edit'),
            onClick: (d): void => setUpdateDetails(d),
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: t('Delete'),
            onClick: (d): void => {
              confirm(t('Confirm delete ?'), async () => {
                await fetch(roomService.deleteRoom(d.id));
                getData();
              });
            },
          },
        ]}
      />

      <CreateModal
        onToast={(): void => {}}
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

export default RoomTable;
