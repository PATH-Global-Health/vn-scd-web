import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { Modal, Form, Popup } from 'semantic-ui-react';

import { FiCheck, FiKey, FiPlus } from 'react-icons/fi';

import moment from 'moment';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from '@app/hooks';
import {
  createContract,
  getContracts,
  activeContract,
} from '@smd/redux/contract';
import { getImplementPackages } from '@smd/redux/implement-package';
import { getIndicators } from '@smd/redux/indicator';

import { FormField } from '@app/models/form-field';
import DataTable, { Column } from '@app/components/data-table';

import { Contract, CBO, SMDPackage as Package } from '@smd/models';
import SimpleForm from '@app/components/simple-form';

import locations from '@app/assets/mock/locations.json';
import { formatTime, toVND } from '@app/utils/helpers';

interface Props {
  cbo?: CBO;
}

const ContractTable: React.FC<Props> = ({ cbo }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getLoading = useSelector((s) => s.smd.contract.getContractsLoading);
  const createLoading = useSelector(
    (s) => s.smd.contract.createContractLoading,
  );
  const activeLoading = useSelector(
    (s) => s.smd.contract.activeContractLoading,
  );
  const { data, pageCount } = useSelector((s) => s.smd.contract.contractData);
  const { data: packageOptions } = useSelector(
    (s) => s.smd.smdPackage.sMDPackageData,
  );
  const { data: indicatorOptions } = useSelector(
    (s) => s.smd.indicator.indicatorData,
  );

  // const getImplementPackagesLoading = useSelector(
  //   (s) => s.smd.implementPackage.getImplementPackagesLoading,
  // );
  const { data: implementPackageOptions } = useSelector(
    (s) => s.smd.implementPackage.implementPackageData,
  );

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<Contract>();

  const getData = useCallback(() => {
    if (cbo) {
      dispatch(getContracts({ cboId: cbo.id, pageIndex, pageSize }));
    }
  }, [dispatch, cbo, pageIndex, pageSize]);

  useEffect(() => {
    getData();
    dispatch(getIndicators());
  }, [dispatch, getData]);

  const columns = useMemo(
    (): Column<Contract>[] => [
      {
        header: t('Package'),
        accessor: 'packageName',
      },
      {
        header: t('Start date'),
        accessor: 'start',
        render: ({ start: date }) =>
          date ? formatTime({ date, isTime: false }) : 'Chưa kích hoạt',
      },
      {
        header: t('End date'),
        accessor: 'end',
        render: ({ end: date }) => formatTime({ date, isTime: false }),
      },
      {
        header: t('Target'),
        accessor: 'targets',
        render: ({ targets }) => {
          const content = targets
            .map((tg) => {
              const indicatorName = t(
                `${
                  indicatorOptions.find((i) => i.id === tg.indicatorId)?.name ??
                  ''
                }`,
              );
              return `${indicatorName}: ${tg.quantity}`;
            })
            .join('; ');
          return (
            <Popup
              className="top center flowing-popup"
              flowing
              size="tiny"
              content={content}
              trigger={
                <span>
                  {`${content.substring(0, 50)}${
                    content.length > 50 ? '...' : ''
                  }`}
                </span>
              }
            />
          );
        },
      },
      {
        header: t('Total Amount'),
        accessor: 'totalAmount',
        render: ({ totalAmount }) => toVND(totalAmount),
      },
      {
        header: t('Current'),
        accessor: 'isCurrent',
        render: ({ isCurrent }) => (isCurrent ? <FiCheck /> : null),
      },
    ],
    [t, indicatorOptions],
  );

  const [selectedPackageId, setSelectedPackageId] = useState<Package['id']>();
  const packageSelect = useMemo(
    () => (
      <div className="ui form" style={{ marginBottom: '15px' }}>
        <Form.Select
          fluid
          search
          deburr
          required
          clearable
          label={t('Package')}
          options={packageOptions.map((p) => ({ text: p.name, value: p.id }))}
          onChange={(_, { value: v }) => setSelectedPackageId(v as string)}
        />
      </div>
    ),
    [t, packageOptions],
  );
  useEffect(() => {
    if (selectedPackageId) {
      dispatch(
        getImplementPackages({
          packageId: selectedPackageId,
          pageIndex: 0,
          pageSize: 1000,
        }),
      );
    }
  }, [dispatch, selectedPackageId]);

  const fields = useMemo(
    (): FormField<Contract>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'iPackageId',
        type: 'select',
        required: true,
        label: t('Implement Package'),
        options: implementPackageOptions.map((e) => ({
          text: `${
            locations.find((p) => p.value === e.province)?.label ?? ''
          } - ${toVND(e.totalAmount)}`,
          value: e.id,
        })),
      },
      {
        name: 'start',
        required: true,
        label: t('From date'),
        inputType: 'date',
      },
      {
        name: 'end',
        required: true,
        label: t('To date'),
        inputType: 'date',
      },
    ],
    [t, implementPackageOptions],
  );

  return (
    <>
      <DataTable
        title={t('Contract Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={getLoading || activeLoading}
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
            title: t('Active'),
            icon: <FiKey />,
            color: 'yellow',
            onClick: async (d) => {
              await dispatch(activeContract(d.id));
              getData();
            },
            hidden: ({ end, isCurrent }) => Boolean(end) || isCurrent,
          },
        ]}
      />
      <Modal open={modal} onClose={() => setModal(false)}>
        <Modal.Header>{t(selecting ? 'Edit' : 'Create New')}</Modal.Header>
        <Modal.Content>
          {packageSelect}
          <SimpleForm
            loading={createLoading}
            defaultValues={selecting}
            formFields={fields}
            onSubmit={async (d) => {
              if (moment(d.start).isSameOrAfter(moment(d.end))) {
                toast.warn('Ngày bắt đầu phải trước ngày kết thúc');
              } else {
                unwrapResult(
                  await dispatch(
                    createContract({ ...d, cboId: cbo?.id ?? '' }),
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

export default ContractTable;
