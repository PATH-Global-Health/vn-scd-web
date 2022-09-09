/* eslint-disable no-useless-escape */
import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { Modal } from 'semantic-ui-react';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useConfirm } from '@app/hooks';
import {
  createCBO,
  getCBOs,
  getCBOsByToken,
  deleteCBO,
  updateCBO,
} from '@smd/redux/cbo';
import { getPackages } from '@smd/redux/smd-package';
import { getProjectByToken } from '@smd/redux/project';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';
import { CBO, Project } from '@smd/models';

import { FormField as IFormField } from '@app/models/form-field';
import DataTable, { Column } from '@app/components/data-table';
import SimpleForm from '@app/components/simple-form';
import CBOFilter from './cbo-filter';

interface Props {
  project?: Project;
  onRowClick: (d: CBO) => void;
}

interface FormField extends CBO {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

const CBOTable: React.FC<Props> = ({ project, onRowClick }) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const projectInfo = useSelector((s) => s.smd.project.projectInfo);
  const getProjectByTokenLoading = useSelector(
    (s) => s.smd.project.getProjectByTokenLoaing,
  );
  const getLoading = useSelector((s) => s.smd.cbo.getCBOsLoading);
  const getByTokenLoading = useSelector((s) => s.smd.cbo.getCBOByTokenLoading);
  const createLoading = useSelector((s) => s.smd.cbo.createCBOLoading);
  const updateLoading = useSelector((s) => s.smd.cbo.updateCBOLoading);
  const deleteLoading = useSelector((s) => s.smd.cbo.deleteCBOLoading);
  const unitTypeOptions = useSelector(
    (state) => state.admin.account.unitType.unitTypeList,
  );

  const { data: d1, pageCount: pc1 } = useSelector((s) => s.smd.cbo.cboData);
  const { data: d2, pageCount: pc2 } = useSelector((s) => s.smd.cbo.cboByToken);
  const data = useMemo(() => {
    if (project && d1) {
      return d1;
    }
    if (d2) {
      return d2;
    }
    return [];
  }, [project, d1, d2]);
  const pageCount = useMemo(() => {
    if (project) {
      return pc1;
    }
    return pc2;
  }, [project, pc1, pc2]);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<FormField>();
  const [filter, setFilter] = useState<{searchValue: string}>({ searchValue: '' });

  const getData = useCallback(() => {
    dispatch(getUnitTypes());
    dispatch(getPackages({ pageSize: 1000, pageIndex: 0 }));
    if (project) {
      dispatch(
        getCBOs({
          isGetAll: false,
          projectId: project.id,
          pageIndex,
          pageSize,
          searchValue: filter.searchValue
        }),
      );
    } else {
      dispatch(getProjectByToken());
      dispatch(getCBOsByToken({ pageIndex, pageSize, searchValue: filter.searchValue }));
    }
  }, [dispatch, project, pageIndex, pageSize, filter]);

  useEffect(getData, [getData]);

  const columns = useMemo(
    (): Column<CBO>[] => [
      { header: t('Name'), accessor: 'name' },
      { header: t('Code'), accessor: 'code' },
      { header: 'Website', accessor: 'website' },
      { header: 'Email', accessor: 'email' },
      { header: t('PhoneNumber'), accessor: 'phone' },
    ],
    [t],
  );

  const fields = useMemo(
    (): IFormField<FormField>[] => [
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
        name: 'unitTypeId',
        type: 'select',
        label: t('Unit Type'),
        options: unitTypeOptions.map((u) => ({
          text: u.typeName,
          value: u.id,
          key: u.id,
        })),
        required: true,
      },
      {
        name: 'location',
        type: 'location',
        locationData: {
          districtCode: selecting?.district ?? '',
          provinceCode: selecting?.province ?? '',
          wardCode: selecting?.ward ?? '',
        },
      },
      {
        name: 'email',
        label: 'Email',
        required: true,
        pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      {
        name: 'phone',
        label: t('PhoneNumber'),
        required: true,
        pattern: /^[0-9\b]+$/,
      },
      {
        name: 'website',
        label: 'Website',
      },
      {
        name: 'username',
        label: t('Username'),
        required: true,
      },
      {
        name: 'password',
        inputType: 'password',
        label: t('Password'),
        required: true,
      },
      {
        name: 'confirmPassword',
        inputType: 'password',
        label: t('Confirm password'),
        required: true,
      },
    ],
    [t, selecting, unitTypeOptions],
  );

  return (
    <>
      <CBOFilter onChange={setFilter}/>
      <DataTable
        title={t('CBOs Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onRowClick={onRowClick}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        loading={
          getLoading ||
          getByTokenLoading ||
          getProjectByTokenLoading ||
          deleteLoading
        }
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
              setSelecting({
                ...d,
                username: '',
                password: '',
                confirmPassword: '',
              });
            },
          },
          {
            title: t('Delete'),
            icon: <FiTrash2 />,
            color: 'red',
            onClick: ({ id }) => {
              confirm(t('Confirm delete ?'), async () => {
                await dispatch(deleteCBO(id));
                getData();
              });
            },
          },
        ]}
      />
      <Modal open={modal} className="cbo-modal" onClose={() => setModal(false)}>
        <Modal.Header>{t(selecting ? 'Edit' : 'Create New')}</Modal.Header>

        <Modal.Content style={{ overflow: 'auto' }}>
          <SimpleForm
            loading={createLoading || updateLoading}
            defaultValues={selecting}
            formFields={
              selecting
                ? fields.filter(
                    ({ name }) =>
                      ![
                        'username',
                        'password',
                        'confirmPassword',
                        'email',
                        'phone',
                      ].includes(name),
                  )
                : fields
            }
            onSubmit={async (d) => {
              const fetchingData: CBO = {
                ...d,
                projectId: project?.id ?? projectInfo?.id ?? '',
                province: d?.location?.provinceCode ?? '',
                district: d?.location?.districtCode ?? '',
                ward: d?.location?.wardCode ?? '',
                isTestingFacility: false,
                isPrEPFacility: false,
                isARTFacility: false,
                email: d?.email ?? selecting?.email ?? '',
                phone: d?.phone ?? selecting?.phone ?? '',
                account: {
                  username: selecting ? '' : d.username,
                  password: selecting ? '' : d.password,
                  confirmPassword: selecting ? '' : d.confirmPassword,
                  email: d?.email ?? selecting?.email ?? '',
                  phone: d?.phone ?? selecting?.phone ?? '',
                },
              };
              try {
                await dispatch(
                  selecting ? updateCBO(fetchingData) : createCBO(fetchingData),
                );
                // setModal(false);
                getData();
              } catch (error) {}
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CBOTable;
