import locations from '@app/assets/mock/locations.json';
import DataTable, { Column } from '@app/components/data-table';
import SimpleForm from '@app/components/simple-form';
import { useDispatch, useSelector } from '@app/hooks';
import { FormField } from '@app/models/form-field';
import { toVND } from '@app/utils/helpers';
import { unwrapResult } from '@reduxjs/toolkit';
import { ImplementPackage } from '@smd/models';
import {
  createImplementPackage,
  getImplementPackages,
  updateImplementPackage
} from '@smd/redux/implement-package';
import { getPackages } from '@smd/redux/smd-package';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit3, FiPlus } from 'react-icons/fi';
import { Modal } from 'semantic-ui-react';
import TargetTable from '../target-table';
import ImplementPackageFilterFilter from './implement-package-filter';

const ImplementPackageTable: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getLoading = useSelector(
    (s) => s.smd.implementPackage.getImplementPackagesLoading,
  );
  const createLoading = useSelector(
    (s) => s.smd.implementPackage.createImplementPackageLoading,
  );
  const updateLoading = useSelector(
    (s) => s.smd.implementPackage.updateImplementPackageLoading,
  );
  const { data, pageCount } = useSelector(
    (s) => s.smd.implementPackage.implementPackageData,
  );

  const packageRoot = useSelector((s) => s.smd.smdPackage.sMDPackageData);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<ImplementPackage>();
  const [filter, setFilter] = useState<{ packageId: string; province: string }>(
    { packageId: '', province: '' },
  );

  const getData = useCallback(() => {
    dispatch(
      getImplementPackages({
        packageId: filter.packageId,
        province: filter.province,
        pageIndex,
        pageSize,
      }),
    );
    dispatch(getPackages({ pageIndex: 0, pageSize: 1000000000 }));
  }, [dispatch, pageIndex, pageSize, filter]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<ImplementPackage>[] => [
      {
        header: t('Package'),
        accessor: 'packageCode',
        render: (r) => `${packageRoot.data.find(p => r.packageCode === p.code)?.name} (${r.packageCode})`,
      },
      {
        header: t('Province/City'),
        accessor: 'province',
        render: (r) =>
          locations.find((p) => r.province === p.value)?.label ?? '',
      },
      {
        header: t('Total Amount'),
        accessor: 'totalAmount',
        render: ({ totalAmount }) => toVND(totalAmount),
      },
      { header: t('Description'), accessor: 'description' },
    ],
    [t, packageRoot],
  );

  const fields = useMemo(
    (): FormField<ImplementPackage>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        type: 'select',
        name: 'province',
        label: t('Province/City'),
        required: true,
        options: locations.map((p) => ({
          key: p.value,
          text: p.label,
          value: p.value,
        })),
      },
      {
        type: 'select',
        name: 'packageId',
        label: t('Package'),
        required: true,
        options: packageRoot.data.map((p) => ({
          key: p.id,
          text: p.name,
          value: p.id,
        })),
      },
      {
        name: 'totalAmount',
        inputType: 'number',
        label: t('Total Amount'),
        required: true,
      },
      {
        name: 'description',
        label: t('Description'),
      },
    ],
    [t, packageRoot],
  );

  return (
    <>
      <ImplementPackageFilterFilter onChange={setFilter} />
      <DataTable
        title={t('ImplementPackage Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={getLoading}
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
        ]}
        subComponent={(r) => <TargetTable iPackage={r} />}
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
                await dispatch(
                  selecting
                    ? updateImplementPackage({
                        ...d,
                        totalAmount: Number(d.totalAmount),
                      })
                    : createImplementPackage({
                        ...d,
                        totalAmount: Number(d.totalAmount),
                      }),
                ),
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

export default ImplementPackageTable;
