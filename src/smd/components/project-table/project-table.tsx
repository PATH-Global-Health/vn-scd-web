/* eslint-disable no-useless-escape */
import React, { useMemo, useEffect, useState, useCallback } from 'react';

import { Modal } from 'semantic-ui-react';

import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { useConfirm, useDispatch, useSelector } from '@app/hooks';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '@smd/redux/project';
import { Project } from '@smd/models';

import DataTable, { Column } from '@app/components/data-table';
import { RowAction, TableAction } from '@app/components/data-table/Action';
import { FormField as IFormField } from '@app/models/form-field';
import SimpleForm from '@app/components/simple-form';
import { unwrapResult } from '@reduxjs/toolkit';
import ProjectFilter from './project-filter';

interface Props {
  onSelect?: (d: Project) => void;
}

interface FormField extends Project {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
}

const ProjectTable: React.FC<Props> = ({ onSelect }) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const getLoading = useSelector((s) => s.smd.project.getProjectsLoading);
  const createLoading = useSelector((s) => s.smd.project.createProjectLoading);
  const updateLoading = useSelector((s) => s.smd.project.updateProjectLoading);
  const deleteLoading = useSelector((s) => s.smd.project.deleteProjectLoading);
  const { data, pageCount } = useSelector((s) => s.smd.project.projectData);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [modal, setModal] = useState(false);
  const [selecting, setSelecting] = useState<FormField>();
  const [filter, setFilter] = useState<{ searchValue: string }>({
    searchValue: '',
  });

  const getData = useCallback(() => {
    dispatch(
      getProjects({ pageIndex, pageSize, searchValue: filter.searchValue }),
    );
  }, [dispatch, pageIndex, pageSize, filter]);

  useEffect(getData, [getData]);

  const tableActions = useMemo((): TableAction<Project>[] => {
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

  const columns = useMemo(
    (): Column<Project>[] => [
      { header: t('Name'), accessor: 'name' },
      { header: t('Code'), accessor: 'code' },
      { header: t('Email'), accessor: 'email' },
      { header: t('PhoneNumber'), accessor: 'phone' },
      { header: t('Description'), accessor: 'description' },
      {
        header: t('Import Type'),
        accessor: 'allowInputType',
        render: (r) =>
          t(r.allowInputType === 0 ? 'Import Raw' : 'Import Report'),
      },
    ],
    [t],
  );

  const rowActions = useMemo((): RowAction<Project>[] => {
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
          setSelecting({
            ...d,
            allowInputType:
              d.allowInputType == 'AGRREGATE' || d.allowInputType == 0 ? 0 : 1,
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
            await dispatch(deleteProject(id));
            getData();
          });
        },
      },
    ];
  }, [t, dispatch, confirm, getData, onSelect]);

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
        type: 'select',
        name: 'allowInputType',
        required: true,
        label: t('Import Type'),
        options: [
          { text: t('Import Raw'), value: 1 },
          { text: t('Import Synthesis Report'), value: 2 },
        ],
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
      {
        name: 'description',
        label: t('Description'),
      },
    ],
    [t],
  );

  return (
    <>
      <ProjectFilter onChange={setFilter} />
      <DataTable
        title={t(onSelect ? 'Project List' : 'Project Management')}
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPaginationChange={(p) => {
          setPageSize(p.pageSize);
          setPageIndex(p.pageIndex);
        }}
        onRowClick={onSelect}
        loading={getLoading || deleteLoading}
        tableActions={tableActions}
        rowActions={rowActions}
      />
      <Modal
        className="project-modal"
        open={modal}
        onClose={() => setModal(false)}
      >
        <Modal.Header>{t(selecting ? 'Edit' : 'Create New')}</Modal.Header>
        <Modal.Content>
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
              const fetchingData: Project = {
                ...d,
                allowInputType: Number(d.allowInputType) - 1,
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
              unwrapResult(
                await dispatch(
                  selecting
                    ? updateProject(fetchingData)
                    : createProject(fetchingData),
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

export default ProjectTable;
