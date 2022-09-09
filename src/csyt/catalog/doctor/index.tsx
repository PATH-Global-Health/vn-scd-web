import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { BiReset } from 'react-icons/bi';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import DataTable, { Column } from '@app/components/data-table';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';

import doctorService from './doctor.service';
import { getDoctors } from './doctor.slice';
import { Doctor } from './doctor.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import { useTranslation } from 'react-i18next';


const DoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const columns: Column<Doctor>[] = [

    { header: t('Code'), accessor: 'code' },
    { header: t('Name'), accessor: 'fullName' },
    { header: t('Identity card'), accessor: 'identityCard' },
    { header: t('Title'), accessor: 'title' },
    { header: t('Academic Title'), accessor: 'academicTitle' },
    { header: t('Email'), accessor: 'email' },
  
    { header: t('PhoneNumber'), accessor: 'phone' },
    {
      header: t('Gender'),
      accessor: 'gender',
      render: (d): string => (d.gender ? t('Male') : t('Female')),
    },
    // { header: 'Tài khoản', accessor: 'Username' },
  ];
  const { doctorList, getDoctorsLoading } = useSelector(
    (state) => state.csyt.catalog.doctor,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getDoctors());
  }, [dispatch]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_DOCTOR, getData);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [openCreate, setOpenCreate] = useState(false);
  const [resetDetails, setResetDetails] = useState<Doctor>();
  const [updateDetails, setUpdateDetails] = useState<Doctor>();

  return (
    <>
      <DataTable
        title={t('Staff')}
        search
        columns={columns}
        data={doctorList.filter(d => d.isDeleted === false)}
        loading={getDoctorsLoading || fetching}
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
            title: t('Update information'),
            onClick: (d): void => setUpdateDetails(d),
          },
          {
            icon: <BiReset />,
            color: 'violet',
            title: t('Password retrieval'),
            onClick: (d): void => {
              setResetDetails(d);
            },
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: t('Delete'),
            onClick: (d): void => {
              confirm(t('Confirm delete ?'), async () => {
                await fetch(doctorService.deleteDoctor(d.id));
                getData();
              });
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

      <ResetPasswordModal
        data={resetDetails!}
        onClose={(): void => setResetDetails(undefined)}
        onRefresh={getData}

      />
    </>
  );
};

export default DoctorsPage;
