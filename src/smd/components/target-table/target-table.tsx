import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { Modal } from 'semantic-ui-react';

import { FiEdit3, FiPlus } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from '@app/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { createTarget, getTargets, updateTarget } from '@smd/redux/target';
import { getIndicators } from '@smd/redux/indicator';
import { Target, ImplementPackage, CollectionResponse } from '@smd/models';

import { FormField } from '@app/models/form-field';
import DataTable, { Column } from '@app/components/data-table';

import SimpleForm from '@app/components/simple-form';

interface Props {
  iPackage: ImplementPackage;
}

const TargetTable: React.FC<Props> = ({ iPackage }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const createLoading = useSelector((s) => s.smd.target.createTargetLoading);
  const updateLoading = useSelector((s) => s.smd.target.updateTargetLoading);

  const [targetData, setTargetData] = useState<CollectionResponse<Target>>();
  const [loading, setLoading] = useState(false);
  const { data, pageCount } = targetData || { data: [], pageCount: 0 };

  const { data: indicatorOptions } = useSelector(
    (s) => s.smd.indicator.indicatorData,
  );

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<Target>();

  const getData = useCallback(() => {
    if (iPackage) {
      const fetch = async () => {
        setLoading(true);
        dispatch(getIndicators());
        const result = unwrapResult(
          await dispatch(
            getTargets({ iPackageId: iPackage.id, pageIndex, pageSize }),
          ),
        );
        setLoading(false);
        setTargetData(result);
      };
      fetch();
    }
  }, [dispatch, iPackage, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<Target>[] => [
      {
        header: t('Indicator'),
        accessor: 'indicatorId',
        render: (d) =>
          t(
            `${
              indicatorOptions.find((e) => e.id === d.indicatorId)?.name ?? ''
            }`,
          ),
      },
      { header: t('Quantity'), accessor: 'quantity' },
    ],
    [t, indicatorOptions],
  );

  const fields = useMemo(
    (): FormField<Target>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        required: true,
        type: 'select',
        name: 'indicatorId',
        label: t('Indicator'),
        options: indicatorOptions.map((i) => ({
          text: t(i.name),
          value: i.id,
        })),
      },
      {
        name: 'quantity',
        inputType: 'number',
        label: t('Quantity'),
        required: true,
      },
    ],
    [t, indicatorOptions],
  );

  return (
    <>
      <DataTable
        title={t('Target Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={loading}
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
                    ? updateTarget({
                        ...d,
                        iPackageId: iPackage.id,
                        quantity: Number(d.quantity),
                      })
                    : createTarget({
                        ...d,
                        iPackageId: iPackage.id,
                        quantity: Number(d.quantity),
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

export default TargetTable;
