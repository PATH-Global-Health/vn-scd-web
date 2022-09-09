import React, { useState, useEffect } from 'react';
import { Button, Form, Header, Label, Modal } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import {
  ARTHistoryModel,
  Customer,
  PrEP,
  PrEPUpdateHistory,
  ReceivedCustomer,
} from '../../models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
import {
  getARTHistory,
  setFormType,
} from '@admin/manage-customer/slices/customer';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  ARTUpdateHistory?: PrEPUpdateHistory;
  onClose: () => void;
  data?: Customer | ReceivedCustomer;
  formType: number;
  // onRefresh: () => void;
}

const CreateARTFormModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onClose, formType, ARTUpdateHistory } = props;
  const { register, handleSubmit, errors } = useForm();
  const [startDate, setStartDate] = useState<string>();
  const { userInfo, token } = useSelector((f) => f.auth);

  useEffect(() => {
    setStartDate(ARTUpdateHistory?.startDate!);
    // dispatch(getDoctors());
  }, [ARTUpdateHistory]);

  const onSubmit = async (data: PrEP) => {
    try {
      const ARTHistory: ARTHistoryModel = {
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
        arT_Infomation: {
          startDate: moment(startDate).format('YYYY-MM-DD'),
          code: data.code,
        },
        tX_ML: [],
      };
      const ARTUpdate: PrEPUpdateHistory = {
        code: data.code,
        id: ARTUpdateHistory?.id!,
        isDelete: false,
        employeeId: ARTUpdateHistory?.employeeId!,
        startDate: moment(startDate).format('YYYY-MM-DD'),
      };
      Boolean(ARTUpdateHistory?.employeeId) &&
        (await customerService.updateARTHistory(ARTUpdate));
      !Boolean(ARTUpdateHistory?.employeeId) &&
        (await customerService.createARTHistory(ARTHistory));
      // await customerService.createARTHistory(ARTHistory);
      dispatch(setFormType(0));
      dispatch(getARTHistory(props.data?.id!));
      setStartDate(undefined);
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
    <Modal open={Boolean(formType === 8)} onClose={onClose}>
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
                Boolean(ARTUpdateHistory) ? ARTUpdateHistory?.code : ''
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

export default CreateARTFormModal;
