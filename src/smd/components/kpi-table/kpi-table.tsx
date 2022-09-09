import React, { useMemo, useEffect, useState, useCallback } from 'react';

import _ from 'lodash';
import { Modal, SemanticCOLORS } from 'semantic-ui-react';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import { unwrapResult } from '@reduxjs/toolkit';
import { useConfirm, useDispatch, useSelector } from '@app/hooks';
import { createKPI, getKPIs, deleteKPI, updateKPI } from '@smd/redux/kpi';
import { Indicator, KPI } from '@smd/models';

import { FormField } from '@app/models/form-field';
import DataTable, { Column } from '@app/components/data-table';
import SimpleForm from '@app/components/simple-form';

interface Props {
  indicator?: Indicator;
}

const colors: SemanticCOLORS[] = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
];

const KPITable: React.FC<Props> = ({ indicator }) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const getLoading = useSelector((s) => s.smd.kpi.getKPIsLoading);
  const createLoading = useSelector((s) => s.smd.kpi.createKPILoading);
  const updateLoading = useSelector((s) => s.smd.kpi.updateKPILoading);
  const deleteLoading = useSelector((s) => s.smd.kpi.deleteKPILoading);
  const { data, pageCount } = useSelector((s) => s.smd.kpi.kPIData);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<KPI>();

  const getData = useCallback(() => {
    if (indicator) {
      dispatch(getKPIs({ indicatorId: indicator.id, pageIndex, pageSize }));
    }
  }, [dispatch, indicator, pageIndex, pageSize]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<KPI>[] => [
      { header: t('From'), accessor: 'from' },
      { header: t('To'), accessor: 'to' },
      { header: t('Color'), accessor: 'color' },
      { header: t('Description'), accessor: 'description' },
    ],
    [t],
  );

  const fields = useMemo(
    (): FormField<KPI>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'from',
        label: t('From'),
        inputType: 'number',
        required: true,
      },
      {
        name: 'to',
        label: t('To'),
        inputType: 'number',
        required: true,
      },
      {
        name: 'color',
        type: 'select',
        label: t('Color'),
        options: colors.map((c) => ({
          text: _.capitalize(c),
          value: c.toUpperCase(),
          label: {
            color: c,
            tag: true,
            content: _.capitalize(c),
          },
        })),
        required: true,
      },
      {
        type: 'textarea',
        name: 'description',
        label: t('Description'),
      },
    ],
    [t],
  );

  return (
    <>
      <DataTable
        title={t('KPI Management')}
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
              setSelecting(undefined);
              setModal(true);
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
                await dispatch(deleteKPI(id));
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
              if (indicator) {
                unwrapResult(
                  await dispatch(
                    selecting
                      ? updateKPI({
                          ...d,
                          indicatorId: indicator.id,
                          from: Number(d.from),
                          to: Number(d.to),
                        })
                      : createKPI({
                          ...d,
                          indicatorId: indicator.id,
                          from: Number(d.from),
                          to: Number(d.to),
                        }),
                  ),
                );

                setModal(false);
                setSelecting(undefined);
                getData();
              }
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default KPITable;
