import React, { useEffect, useCallback, useState } from 'react';
import { Popup } from 'semantic-ui-react';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useFetchApi,
} from '@app/hooks';

import { getServices } from './service.slice';
import { getServiceTypes } from '../service-type/service-type.slice';
import { Service } from './service.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import { getServiceForms } from '../service-form/service-form.slice';
import { getInjectionObjects } from '../injection-object/injection-object.slice';
import { useTranslation } from 'react-i18next';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { serviceList, getServicesLoading } = useSelector(
    (state) => state.csyt.catalog.service,
  );
  const { serviceFormList } = useSelector(
    (state) => state.csyt.catalog.serviceForm,
  );
  const { injectionObjectList } = useSelector(
    (state) => state.csyt.catalog.injectionObject,
  );
  const { serviceTypeList } = useSelector(
    (state) => state.csyt.catalog.serviceType,
  );

  const columns: Column<Service>[] = [
    { accessor: 'code', header: t('Code') },
    {
      accessor: 'name',
      header: t('Service'),
      render: (row): React.ReactNode => (
        <Popup
          className="top center flowing-popup"
          flowing
          size="tiny"
          content={row.name}
          trigger={
            <span>
              {`${row.name.substring(0, 50)}${
                row.name.length > 50 ? '...' : ''
              }`}
            </span>
          }
        />
      ),
    },
    {
      accessor: 'serviceFormId',
      header: t('Service Form'),
      render: (r: Service) =>
        serviceFormList.find((sf) => sf.id === r.serviceFormId)?.name,
    },
    {
      accessor: 'serviceTypeId',
      header: t('Type'),
      render: (r: Service) =>
        serviceTypeList.find((st) => st.id === r.serviceTypeId)?.description,
    },
    {
      accessor: 'injectionObjectId',
      header: t('Object'),
      render: (r: Service) =>
        injectionObjectList.find((st) => st.id === r.injectionObjectId)?.name,
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getServiceForms());
    dispatch(getServiceTypes());
    dispatch(getInjectionObjects());
  }, [dispatch]);
  const getData = useCallback(() => {
    dispatch(getServices());
  }, [dispatch]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_SERVICE, getData);
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Service>();

  const { fetching } = useFetchApi();

  const loading = fetching || getServicesLoading;
  return (
    <>
      <DataTable
        title={t('Service')}
        loading={loading}
        columns={columns}
        data={serviceList}
        // tableActions={[
        //   {
        //     icon: <FiPlus />,
        //     title: 'Tạo',
        //     color: 'green',
        //     onClick: (): void => setOpenCreate(true),
        //   },
        // ]}
        // rowActions={[
        //   {
        //     icon: <FiEdit2 />,
        //     title: 'Sửa',
        //     color: 'violet',
        //     onClick: (r): void => setUpdateDetails(r),
        //   },
        //   {
        //     icon: <FiTrash2 />,
        //     title: 'Xoá',
        //     color: 'red',
        //     onClick: (r): void => {
        //       confirm(
        //         'Xác nhận xoá',
        //         async (): Promise<void> => {
        //           await fetch(serviceService.deleteService(r.id));
        //           getData();
        //         },
        //       );
        //     },
        //   },
        // ]}
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
    </>
  );
};

export default ServicesPage;
