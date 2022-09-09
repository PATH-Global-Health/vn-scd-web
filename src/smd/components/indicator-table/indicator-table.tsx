import DataTable, { Column } from '@app/components/data-table';
import { RowAction, TableAction } from '@app/components/data-table/Action';
import SimpleForm from '@app/components/simple-form';
import { useConfirm, useDispatch, useSelector } from '@app/hooks';
import { FormField } from '@app/models/form-field';
import { unwrapResult } from '@reduxjs/toolkit';
import { Indicator } from '@smd/models';
import {
  createIndicator, deleteIndicator, getIndicators, updateIndicator
} from '@smd/redux/indicator';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from 'semantic-ui-react';
import IndicatorFilter from './indicator-filter';

interface Props {
  onSelect?: (data?: Indicator) => void;
}

const IndicatorTable: React.FC<Props> = ({ onSelect }) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const getLoading = useSelector((s) => s.smd.indicator.getIndicatorsLoading);
  const createLoading = useSelector(
    (s) => s.smd.indicator.createIndicatorLoading,
  );
  const updateLoading = useSelector(
    (s) => s.smd.indicator.updateIndicatorLoading,
  );
  const deleteLoading = useSelector(
    (s) => s.smd.indicator.deleteIndicatorLoading,
  );
  const { data } = useSelector((s) => s.smd.indicator.indicatorData);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<Indicator>();
  const [filter, setFilter] = useState<object>({searchValue: ''});

  const getData = useCallback(() => {
    dispatch(getIndicators(filter));
  }, [dispatch, filter]);

  useEffect(getData, [getData, filter]);

  const columns: Column<Indicator>[] = [
    { header: t('Name'), accessor: 'name', render: ({ name }) => t(`${name}`) },
    { header: t('Code'), accessor: 'code' },
    { header: t('Description'), accessor: 'description' },
  ];

  const tableActions = useMemo((): TableAction<Indicator>[] => {
    if (onSelect) {
      return [];
    }
    return [
      {
        title: t('Add'),
        icon: <FiPlus />,
        color: 'green',
        onClick: () => {
          setModal(true);
          setSelecting(undefined);
        },
      },
    ];
  }, [t, onSelect]);

  const rowActions = useMemo((): RowAction<Indicator>[] => {
    if (onSelect) {
      return [];
    }
    return [
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
            await dispatch(deleteIndicator(id));
            getData();
          });
        },
      },
    ];
  }, [t, dispatch, confirm, getData, onSelect]);

  const fields = useMemo(
    (): FormField<Indicator>[] => [
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
      <IndicatorFilter onChange={setFilter} />
      <DataTable
        title={onSelect ? t('Indicator List') : t('Indicator Management')}
        columns={columns}
        data={data}
        onRowClick={onSelect}
        loading={getLoading || deleteLoading}
        tableActions={tableActions}
        rowActions={rowActions}
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
                  selecting ? updateIndicator(d) : createIndicator(d),
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

export default IndicatorTable;
