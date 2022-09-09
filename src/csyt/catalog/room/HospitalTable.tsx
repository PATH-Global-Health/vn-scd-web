import React, { useEffect, useCallback, useMemo } from 'react';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';
import { useSelector, useDispatch } from '@app/hooks';
import { Hospital } from '../hospital/hospital.model';
import { getHospitals, selectHospital } from './room.slice';
import { useTranslation } from 'react-i18next';

const HospitalTable: React.FC = () => {
  const { t } = useTranslation();
  const { hospitalList, getHospitalLoading } = useSelector(
    (state) => state.csyt.catalog.room,
  );
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getHospitals());
  }, [dispatch]);
  useEffect(getData, [getData]);

  // useRefreshCallback(
  //   GroupKey.CSYT_CATALOG,
  //   ComponentKey.CSYT_ROOM,
  //   (): void => {
  //     getData();
  //     dispatch(selectHospital(undefined));
  //   },
  // );

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

  const loading = getHospitalLoading || getUnitTypesLoading;
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
      />
    </>
  );
};

export default HospitalTable;
