import React, { useState, useEffect } from 'react';
import { Button, Form, Header, Label, Modal } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import {
  Customer,
  PrEP,
  PrEPHistoryModel,
  PrEPUpdateHistory,
  ReceivedCustomer,
} from '../../models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
// import { getDoctors } from '@csyt/catalog/doctor/doctor.slice';
import {
  getPrEPHistory,
  setFormType,
} from '@admin/manage-customer/slices/customer';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  prEPUpdateHistory?: PrEPUpdateHistory;
  onClose: () => void;
  data?: Customer | ReceivedCustomer;
  formType: number;
  // onRefresh: () => void;
}

const CreatePrEPFormModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onClose, formType, prEPUpdateHistory } = props;
  const { register, handleSubmit, errors } = useForm();
  const [startDate, setStartDate] = useState<string>();
  const { userInfo, token } = useSelector((f) => f.auth);

  useEffect(() => {
    setStartDate(prEPUpdateHistory?.startDate!);
    // dispatch(getDoctors());
  }, [prEPUpdateHistory]);

  const onSubmit = async (data: PrEP) => {
    try {
      const PrEPHistory: PrEPHistoryModel = {
        app: {
          appId: 'test',
          name: 'Test',
        },
        facility: {
          facilityId: token?.userId!,
          name: userInfo?.name!,
        },
        customer: props.data!,
        cdO_Employee: {
          employeeId: '',
          name: '',
        },
        prEP_Infomation: {
          startDate: moment(startDate).format('YYYY-MM-DD'),
          code: data.code,
        },
        tX_ML: [],
      };

      const PrEPtUpdate: PrEPUpdateHistory = {
        code: data.code,
        id: prEPUpdateHistory?.id!,
        isDelete: false,
        employeeId: prEPUpdateHistory?.employeeId!,
        startDate: moment(startDate).format('YYYY-MM-DD'),
      };
      Boolean(prEPUpdateHistory?.employeeId) &&
        (await customerService.updatePrEPHistory(PrEPtUpdate));
      !Boolean(prEPUpdateHistory?.employeeId) &&
        (await customerService.createPrEPHistory(PrEPHistory));

      dispatch(setFormType(0));
      dispatch(getPrEPHistory(props.data?.id!));
      //   setStartDate(new Date());
      onClose();
      toast(
        <ToastComponent
          content={t('Successful receive treatment update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed receive treatment update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <Modal open={Boolean(formType === 6)} onClose={onClose}>
      <Modal.Content>
        <Header as="h3">{t('Receive treatment')}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label style={{ fontWeight: 'bold' }} className="requiredLabel">
            {t('Reception date')}
          </label>
          <Form.Field>
            <DatePicker
              value={new Date(moment(startDate).format('YYYY-MM-DD'))}
              onChange={(value: Date) =>
                setStartDate(moment(value).format('YYYY-MM-DD'))
              }
            ></DatePicker>
          </Form.Field>
          <Form.Field>
            <label className="requiredLabel">{t('Treatment code')}</label>
            <input
              defaultValue={
                Boolean(prEPUpdateHistory) ? prEPUpdateHistory?.code : ''
              }
              name="code"
              ref={register({
                required: { value: true, message: t('Code not enter') },
              })}
            />
            {errors.code && (
              <Label basic color="red" pointing>
                {errors.code.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <Button
              // disabled={!Boolean(startDate)}
              primary
              type="submit"
              value="Save"
            >
              {t('Submit')}
            </Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default CreatePrEPFormModal;
