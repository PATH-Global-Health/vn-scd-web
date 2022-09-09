import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  // useRef,
} from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiUpload } from 'react-icons/fi';
import { Image } from 'semantic-ui-react';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';

import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useConfirm,
  useFetchApi,
} from '@app/hooks';
import styled from 'styled-components';

import { getHospitals } from '../slices/hospital';
import { getUnitTypes } from '../slices/unit-type';

import CreateModal from '../components/hospital/CreateModal';
import { Hospital } from '../models/hospital';
import UpdateModal from '../components/hospital/UpdateModal';
import { hospitalService } from '../services';
import { useTranslation } from 'react-i18next';

const StyledSpan = styled.span`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 20px;
  // background: #00bfff;
  cursor: pointer;
  color: #fff;
  // padding: 10px 0;
  text-transform: uppercase;
  font-size: 12px;
  text-align: center;
  border: 1px solid #bbbec1;
  border-radius: 5px;
`;

const StyledInput = styled.input`
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 100%;
  // height: 50px;
  top: 0;
  left: 0;
  opacity: 0;
  // cursor: pointer;
`;

const StyledDivWrapper = styled.div`
  position: relative;
  // width: 150px;
  text-align: left;
  margin: 10% auto;
`;

const HospitalAccountsPage: React.FC = () => {
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

  useRefreshCallback(
    GroupKey.ADMIN_ACCOUNT,
    ComponentKey.ADMIN_HOSPITALS,
    getData,
  );
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const [selecting, setSelecting] = useState<Hospital>();

  // const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  // const handleClick = () => {
  //   if (fileRef.current !== null) {
  //     fileRef.current.click();
  //   }
  // };
  useEffect(() => {
    if (selectedFile && selecting) {
      const formData = new FormData();
      formData.append('Id', selecting.id);
      formData.append('Picture', selectedFile);
      fetch(hospitalService.updateLogo(formData)).then(getData);
      setSelectedFile(undefined);
    }
  }, [fetch, selectedFile, getData, selecting]);

  const columns: Column<Hospital>[] = useMemo(
    (): Column<Hospital>[] => [
      {
        header: t('Image'),
        accessor: 'logo',
        render: (d) => (
          <>
            <Image
              circular
              size="tiny"
              src={'data:image/png;base64,' + d.logo}
            />
            <StyledDivWrapper>
              <StyledSpan className="label">
                <FiUpload color="#bbbec1  " />
              </StyledSpan>
              <StyledInput
                // hidden
                // id="selectImage"
                // className="selectImage"
                type="file"
                accept="image/*"
                // ref={fileRef}
                onChange={(e) => {
                  if (e.target !== null && e.target.files !== null) {
                    setSelectedFile(e.target.files[0]);
                    setSelecting(d);
                  }
                }}
              />
            </StyledDivWrapper>
          </>
        ),
      },
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

  const confirm = useConfirm();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const loading = getHospitalsLoading || getUnitTypesLoading;
  return (
    <>
      <DataTable
        search
        title={t('Hospital')}
        loading={loading || fetching}
        columns={columns}
        data={hospitalList}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: t('Add'),
            onClick: (): void => {
              setCreateModal(true);
              setSelecting(undefined);
            },
          },
        ]}
        rowActions={[
          // {
          //   icon: <FiUpload />,
          //   title: t('Update image'),
          //   color: 'blue',
          //   onClick: (r): void => {
          //     setSelecting(r);
          //     //  (r);
          //     handleClick();
          //   },
          // },
          {
            icon: <FiEdit3 />,
            title: t('Edit'),
            color: 'violet',
            onClick: (r): void => {
              setUpdateModal(true);
              setSelecting(r);
              // dispatch(selectHospital(r));
            },
          },
          {
            icon: <FiTrash2 />,
            title: t('Delete'),
            color: 'red',
            onClick: (r): void => {
              confirm(
                t('Confirm delete ?'),
                async (): Promise<void> => {
                  await fetch(hospitalService.deleteHospital(r.id));
                  getData();
                },
              );
            },
          },
        ]}
      />

      <CreateModal
        open={createModal}
        onClose={(): void => setCreateModal(false)}
        onRefresh={getData}
      />

      <UpdateModal
        open={updateModal}
        onClose={(): void => {
          setSelecting(undefined);
          setUpdateModal(false);
        }}
        data={selecting}
        onRefresh={getData}
      />
    </>
  );
};

export default HospitalAccountsPage;
