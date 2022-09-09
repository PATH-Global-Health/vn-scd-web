import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Header,
  Label,
  Modal,
  Select,
} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import { Customer, PrEPHistoryModel, TX_ML } from '../../models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
import {
  getPrEPHistory,
  setFormType,
} from '@admin/manage-customer/slices/customer';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  // open: boolean;
  onClose: () => void;
  data: Customer;
  formType: number;
  // onRefresh: () => void;
}

const CreateTX_ML_FormModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onClose, formType } = props;
  const { register, handleSubmit, errors } = useForm();
  const [reportDate, setReportDate] = useState<Date>();
  const [status, setStatus] = useState();
  const [isLate, setIsLate] = useState<number>(0);
  const { userInfo, token } = useSelector((f) => f.auth);

  const statusTX_MLOpions = [
    {
      key: 0,
      text: t('Stopping treatment'),
      value: 'Bỏ trị',
    },
    {
      key: 1,
      text: t('Move'),
      value: 'Chuyển đi',
    },
    {
      key: 2,
      text: t('Dead'),
      value: 'Tử vong',
    },
  ];

  const onSubmit = async (data: TX_ML) => {
    try {
      const TX_MLList = [] as TX_ML[];
      TX_MLList.push({
        isLate: isLate!,
        reportDate: moment(reportDate).format('YYYY-MM-DD'),
        status: status!,
        timingLate: data.timingLate,
      });

      const PrEPHistory: PrEPHistoryModel = {
        app: {
          appId: 'test',
          name: 'Test',
        },
        facility: {
          facilityId: token?.userId!,
          name: userInfo?.name!,
        },
        customer: props.data,
        cdO_Employee: {
          employeeId: '',
          name: '',
        },
        prEP_Infomation: {
          startDate: moment(new Date()).format('YYYY-MM-DD'),
          code: '',
        },
        tX_ML: TX_MLList,
      };
      await customerService.createPrEPHistory(PrEPHistory);
      dispatch(setFormType(0));
      dispatch(getPrEPHistory(props.data.id));
      setIsLate(0);
      setReportDate(undefined);
      setStatus(undefined);
      onClose();
      toast(
        <ToastComponent
          content={t('Successful stopping treatment update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed stopping treatment update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <Modal open={Boolean(formType === 7)} onClose={onClose}>
      <Modal.Content>
        <Header as="h3">{t('Update information on stopping treatment')}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label style={{ fontWeight: 'bold' }} className="requiredLabel">
            {t('The earliest time of the reporting period')}
          </label>
          <Form.Field
            control={DatePicker}
            onChange={(value: Date) => setReportDate(value)}
          />

          <Form.Field>
            <label className="requiredLabel">{t('Timing late')}</label>
            <input
              name="timingLate"
              ref={register({
                required: {
                  value: true,
                  message: t('Timing late not entered'),
                },
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: t('Timing late contains digits from 0 -> 9'),
                },
              })}
            />
            {errors.timingLate && (
              <Label basic color="red" pointing>
                {errors.timingLate.message}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <label className="requiredLabel">{t('Treatment status')}</label>
            <Select
              // placeholder='Tình trạng điều trị'
              options={statusTX_MLOpions}
              // defaultValue={true}
              onChange={(e: any, d: any) => setStatus(d.value)}
            />
          </Form.Field>

          <Form.Field>
            <Checkbox
              onChange={(e: any, data: any) =>
                data.checked ? setIsLate(1) : setIsLate(0)
              }
              label={t('Missed')}
            />
          </Form.Field>

          {/* <Form.Field>
                        <label className="required">Mã xét nghiệm tại cộng đồng</label>
                        <input name="code" ref={register()} />

                    </Form.Field> */}

          <Form.Field>
            <Button
              disabled={!Boolean(reportDate && status)}
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

export default CreateTX_ML_FormModal;
