import React, { useState, useEffect } from 'react';
import { Button, Form} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import { Customer, ReferModel} from '../../models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
import { getDoctors } from '@csyt/catalog/doctor/doctor.slice';
import moment from 'moment';
import { getCustomers, setReferFormType } from '@admin/manage-customer/slices/customer';
import { useTranslation } from 'react-i18next';

interface Props {
    data: Customer;
    formType: number;
    onClose: () => void;
}

const CreateReferFormModal: React.FC<Props> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { onClose } = props;
    const { register, handleSubmit } = useForm();
    const [referDate, setReferDate] = useState<Date>();
  
    const { selectedReferHospital } = useSelector(
        (state) => state.admin.account.hospital,
    );

    const {
        selectedHospital,
      } = useSelector((state) => state.admin.customer.customer);

    const { referFormType } = useSelector(
        (state) => state.admin.customer.customer,
    );

    useEffect(() => {
        dispatch(getDoctors());
    }, [dispatch])

    const onSubmit = async (data: ReferModel) => {
        try {
            const referData: ReferModel = {
                status: data.status,
                note: data.note,
                profileId: props.data.id,
                referDate: moment(referDate).format("YYYY-MM-DD"),
                toUnitId: selectedReferHospital?.id!,
                type: referFormType,

            }
            await customerService.createReferTicket(referData);
            await dispatch(getCustomers(selectedHospital?.id!));
            onClose();
            dispatch(setReferFormType(-1));
            toast(
                <ToastComponent
                    content={t('Successful treatment transfer')}
                    type="success"
                />,
            );
        } catch (error) {
            toast(
                <ToastComponent
                    content={t('Failed treatment transfer')}
                    type="failed"
                />,
            );
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* <label style={{ fontWeight: 'bold' }} className="requiredLabel">{t('Refer date')}</label> */}
            <Form.Field
                required
                label={t('Refer date')}
                control={DatePicker}
                onChange={(value: Date) => setReferDate(value)}
            />

            <Form.Field>
                <label >{t('Note')}</label>
                <input name="note" ref={register()} />
            </Form.Field>

            <Form.Field>
                <Button disabled={!Boolean(referDate)} primary type="submit" value="Save">{t('Submit')}</Button>
            </Form.Field>
        </Form>
    );
};

export default CreateReferFormModal;
