import React, { useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps, Image, Modal } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import locations from '@app/assets/mock/locations.json';
import styled from 'styled-components';

import { Customer } from '../../manage-customer/models/customer';
import DataTable, { Column } from '@app/components/data-table';
import { Hospital } from '@admin/manage-account/models/hospital';
import { setSlectedReferHospital } from '@admin/manage-account/slices/hospital';
import { FiChevronRight } from 'react-icons/fi';
import CreateReferFormModal from './formReferTicket/CreateReferFormModal';
import { useTranslation } from 'react-i18next';

const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
  margin-left: 10px;
`;

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;

interface Props {
    open: boolean;
    onClose: () => void;
    data?: Customer;
}

const ReferModal: React.FC<Props> = (props) => {
    const { t } = useTranslation();
    const { open, onClose } = props;

    const { referHospital, selectedReferHospital, getHospitalsLoading } = useSelector(
        (state) => state.admin.account.hospital,
    );
    const { unitTypeList } = useSelector(
        (state) => state.admin.account.unitType,
    );

    const dispatch = useDispatch();

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
                            src={"data:image/png;base64," + d.logo}
                        />
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
        [t, unitTypeList],
    );

    const sections = useMemo((): BreadcrumbSectionProps[] => {
        const bc: BreadcrumbSectionProps[] = [
            {
                key: 0,
                content: !selectedReferHospital ? t('Sub facility') : selectedReferHospital.name,
                active: !selectedReferHospital,
                onClick: (): void => {
                    dispatch(setSlectedReferHospital(undefined));
                },
            },
        ];

        if (selectedReferHospital) {
            bc.push({
                key: 1,
                content: t('Information'),
                active: true,
                onClick: (): void => {
                    dispatch(setSlectedReferHospital(undefined));
                },
            });
        }

        // if (selectedWorkingCalendar) {
        //   bc.push({
        //     key: 2,
        //     content: 'Lịch ngày',
        //     active: !selectedWorkingCalendarDay,
        //     onClick: (): void => {
        //       dispatch(selectWorkingCalendarDay(undefined));
        //     },
        //   });
        // }

        // if (selectedWorkingCalendarDay) {
        //   bc.push({
        //     key: 3,
        //     content: 'Lịch giờ',
        //     active: true,
        //   });
        // }

        return bc;
    }, [
        dispatch,
        selectedReferHospital,
        t
    ]);

    return (
        <Modal open={open} onClose={() => { onClose(); dispatch(setSlectedReferHospital(undefined)) }}>
            <Modal.Header>
                <BreadcrumbWrapper>
                    <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
                </BreadcrumbWrapper>
            </Modal.Header>

            <Modal.Content>
                {!selectedReferHospital && <DataTable
                    loading={getHospitalsLoading}
                    search
                    title={t('Sub facility')}
                    // loading={loading || fetching}
                    columns={columns}
                    data={referHospital}
                    onRowClick={(row): void => {
                        dispatch(setSlectedReferHospital(row));
                    }}
                />}
                {selectedReferHospital && <CreateReferFormModal onClose={onClose} data={props?.data!} formType={2}></CreateReferFormModal>}
            </Modal.Content>
        </Modal>
    );
};

export default ReferModal;
