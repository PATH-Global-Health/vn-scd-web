import React, { useState } from 'react';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { DatePicker } from '@app/components/date-picker';
import { toast } from 'react-toastify';

import { customerService } from '../../../services';
import { ReceivedCustomer } from '../../../models/customer';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
    open: boolean;
    onClose: () => void;
    data?: ReceivedCustomer;
    onRefresh: () => void;
}

const UpdateRecivedModal: React.FC<Props> = (props) => {
    const { t } = useTranslation();
    const { open, onClose, onRefresh } = props;

    const { handleSubmit } = useForm();
    const [receivedDate, setReceivedDate] = useState<Date>();
    const onSubmit = async (data: ReceivedCustomer) => {
        try {
            await customerService.updateReceiveCustomers({
                ...props.data!,
                receivedDate: moment(receivedDate).format('YYYY-MM-DD'),
                status: 1
            });
            onRefresh();
            onClose();
            toast(
                <ToastComponent
                    content={t('Successful receive')}
                    type="success"
                />,
            );
        } catch (error) {
            toast(
                <ToastComponent
                    content={t('Failed receive')}
                    type="failed"
                />,
            );
        }
    };

    return (
        <Modal open={open} onClose={() => { onClose(); setReceivedDate(undefined)}}>
            <Modal.Content>
                <Header as="h3">{t('Reception date')}</Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Field
                        control={DatePicker}
                        onChange={(value: Date) => setReceivedDate(value)}
                    />
                    <Form.Field>
                        <Button disabled={!Boolean(receivedDate)} primary type="submit" value="Save">{t('Submit')}</Button>
                    </Form.Field>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default UpdateRecivedModal;
