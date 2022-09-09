import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { Modal } from 'semantic-ui-react';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';
import { unwrapResult } from '@reduxjs/toolkit';
import { useConfirm, useDispatch, useSelector } from '@app/hooks';
import {
  createPackage,
  getPackages,
  deletePackage,
  updatePackage,
} from '@smd/redux/smd-package';

import { FormField } from '@app/models/form-field';
import DataTable, { Column } from '@app/components/data-table';

import { SMDPackage } from '@smd/models';
import SimpleForm from '@app/components/simple-form';


const PackageTable: React.FC = () => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const getLoading = useSelector((s) => s.smd.smdPackage.getPackagesLoading);
  const createLoading = useSelector(
    (s) => s.smd.smdPackage.createPackageLoading,
  );
  const updateLoading = useSelector(
    (s) => s.smd.smdPackage.updatePackageLoading,
  );
  const deleteLoading = useSelector(
    (s) => s.smd.smdPackage.deletePackageLoading,
  );
  const { data, pageCount } = useSelector(
    (s) => s.smd.smdPackage.sMDPackageData,
  );

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<SMDPackage>();

  const getData = useCallback(() => {
    dispatch(getPackages({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<SMDPackage>[] => [
      { header: t('Name'), accessor: 'name' },
      { header: t('Code'), accessor: 'code' },
      { header: t('Description'), accessor: 'description' },
    ],
    [t],
  );

  const fields = useMemo(
    (): FormField<SMDPackage>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'name',
        label: t('Name'),
        required: true,
      },
      {
        name: 'code',
        label: t('Code'),
        required: true,
      },
      {
        name: 'description',
        label: t('Description'),
      },
    ],
    [t],
  );

  return (
    <>
      <DataTable
        title={t('Package Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={getLoading || deleteLoading}
        tableActions={[
          {
            title: t('Add'),
            icon: <FiPlus />,
            color: 'green',
            onClick: () => {
              setModal(true);
              setSelecting(undefined);
            },
          },
        ]}
        rowActions={[
          {
            title: t('Edit'),
            icon: <FiEdit3 />,
            color: 'violet',
            onClick: (d) => {
              setModal(true);
              setSelecting(d);
            },
          },
          {
            title: t('Delete'),
            icon: <FiTrash2 />,
            color: 'red',
            onClick: ({ id }) => {
              confirm(t('Confirm delete ?'), async () => {
                await dispatch(deletePackage(id));
                getData();
              });
            },
          },
        ]}
      />
      <Modal open={modal} onClose={() => setModal(false)}>
        <Modal.Header>{t(selecting ? 'Edit' : 'Create New')}</Modal.Header>
        <Modal.Content>
          <SimpleForm
            loading={createLoading || updateLoading}
            defaultValues={selecting}
            formFields={fields}
            onSubmit={async (d) => {
              unwrapResult(
                await dispatch(selecting ? updatePackage(d) : createPackage(d)),
              );
              setModal(false);
              setSelecting(undefined);
              getData();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default PackageTable;
