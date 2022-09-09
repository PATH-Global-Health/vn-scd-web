import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import styled from 'styled-components';
import { Customer } from '../../manage-customer/models/customer';
import { Tab } from 'semantic-ui-react'
import { getTestingHistory } from '../slices/customer';
import TestingPane from './tab/historyTab/testing/TestingPane';
import InfomationPane from './tab/historyTab/infomation/InfomationPane';
import PrEPPane from './tab/historyTab/PrEP/PrEPPane';
import ARTPane from './tab/historyTab/ART/ARTPane';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(Modal)`
width: 100% !important;
height: 100% !important;
`;

interface Props {
    open: boolean;
    onClose: () => void;
    data?: Customer;
    onRefresh: () => void;
}

const HistoryModal: React.FC<Props> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { customer } = useSelector(c => c.admin.customer.customer);
    const [activePage] = useState<string>("1");

    //-----------------------------------------------------------------------------

    const getData = useCallback(() => {
        dispatch(getTestingHistory({ customerId: customer?.id!, pageIndex: Number.parseInt(activePage), pageSize: 10 }));
    }, [activePage, customer, dispatch]);

    useEffect(getData, [getData]);

    const panes = [
        {
            menuItem: t('Customer information'), render: () =>
                <Tab.Pane attached={false}>
                    <InfomationPane onRefresh={props.onRefresh}></InfomationPane>
                </Tab.Pane>
        },
        {
            menuItem: t('Testing'), render: () =>
                <Tab.Pane attached={false}>
                    <TestingPane></TestingPane>
                </Tab.Pane>
        },
        {
            menuItem: t('PrEP'), render: () =>
                <Tab.Pane attached={false}>
                    <PrEPPane></PrEPPane>
                </Tab.Pane>
        },
        {
            menuItem: t('ART'), render: () =>
                <Tab.Pane attached={false}>
                    <ARTPane></ARTPane>
                </Tab.Pane>
        },
    ];

    const { open, onClose } = props;
    return (
        <>
            <StyledModal open={open} onClose={onClose} size='fullscreen' closeIcon>
                <Modal.Header content>{t('Treatment history')}</Modal.Header>
                <Modal.Content>
                    <Tab menu={{ pointing: true }} panes={panes} />
                </Modal.Content>
            </StyledModal>
        </>
    );
};

export default HistoryModal;
