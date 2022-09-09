import React, { useEffect, useCallback, useMemo } from 'react';

import { GroupKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { getHospitals } from '@admin/manage-account/slices/hospital';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';

import { Hospital } from '@admin/manage-account/models/hospital';
import { selectHospital } from '../working-schedule.slice';
import { useTranslation } from 'react-i18next';

const WorkingCalendarHospitalTable: React.FC = () => {
  const { t } = useTranslation();
  const { hospitalList, getHospitalsLoading } = useSelector(
    (state) => state.admin.account.hospital,
  );
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getHospitals());
    dispatch(getUnitTypes());
  }, [dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.CSYT_WORKING_SCHEDULE,
    GroupKey.CSYT_WORKING_SCHEDULE,
    (): void => {
      getData();
      dispatch(selectHospital(undefined));
    },
  );

  const columns: Column<Hospital>[] = useMemo(
    (): Column<Hospital>[] => [
      {
        header: t('Name'),
        accessor: 'name',
      },
      {
        header: t('Type'),
        accessor: 'unitTypeId',
        render: (d): string =>
          unitTypeList.find((u) => u.id === d.unitTypeId)?.typeName ?? '',
      },
      {
        header: t('Province/City'),
        accessor: 'province',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          return province?.label ?? '';
        },
      },
      {
        header: t('District'),
        accessor: 'district',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          return district?.label ?? '';
        },
      },
      {
        header: t('Ward'),
        accessor: 'ward',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          const ward = district?.wards.find((w) => w.value === d.ward);
          return ward?.label ?? '';
        },
      },
    ],
    [unitTypeList, t],
  );

  const loading = getHospitalsLoading || getUnitTypesLoading;
  return (
    <>
      <DataTable
        search
        loading={loading}
        columns={columns}
        data={hospitalList}
        onRowClick={(row): void => {
          dispatch(selectHospital(row));
        }}
        tableActions={[]}
        rowActions={[]}
      />
    </>
  );
};

export default WorkingCalendarHospitalTable;
