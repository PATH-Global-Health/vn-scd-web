import React, { useState } from 'react';
import { Button, Form, Header, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import {
  Customer,
  ResultTesting,
  TestingHistoryModel,
} from '../../models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
import moment from 'moment';
import { getTestingHistory } from '@admin/manage-customer/slices/customer';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  data: Customer;
  formType: number;
}

const CreateRecencyModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const resultTestingOptions = [
    { value: 'Dương tính', text: t('Positive') },
    { value: 'Âm tính', text: t('Negative') },
    { value: 'Không có kết quả', text: t('No result') },
  ];
  const dispatch = useDispatch();
  const { onClose, formType } = props;
  const { register, handleSubmit, errors } = useForm();
  const [resultTesting, setResultTesting] = useState();
  const [resultDate, setResultDate] = useState<Date>();
  const [takenDate, setTakenDate] = useState<Date>();
  const { userInfo, token } = useSelector((f) => f.auth);

  const onSubmit = async (data: ResultTesting) => {
    try {
      const LayTest: TestingHistoryModel = {
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
        result: {
          ...data,
          type: 4,
          viralLoad: -1,
          examinationForm: -1,
          hivPublicExaminationDate: 0,
          resultTesting: resultTesting!,
          resultDate: moment(resultDate).format('YYYY-MM-DD'),
          takenDate: takenDate?.getTime()!,
        },
      };
      await customerService.createTestingHistory(LayTest);
      dispatch(
        getTestingHistory({
          customerId: props.data.id,
          pageIndex: 1,
          pageSize: 10,
        }),
      );
      setResultDate(undefined);
      setTakenDate(undefined);
      setResultTesting(undefined);
      onClose();
      toast(
        <ToastComponent
          content={t('Successful recency test update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed recency test update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <Modal open={Boolean(formType === 4)} onClose={onClose}>
      <Modal.Content>
        <Header as="h3">{t('Recency test')}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label style={{ fontWeight: 'bold' }} className="requiredLabel">
            {t('Sample date')}
          </label>
          <Form.Field
            control={DatePicker}
            onChange={(value: Date) => setTakenDate(value)}
          />

          <label style={{ fontWeight: 'bold' }} className="requiredLabel">
            {t('Result date')}
          </label>
          <Form.Field
            control={DatePicker}
            onChange={(value: Date) => setResultDate(value)}
          />

          <Form.Field>
            <label className="requiredLabel">{t('Result')}</label>
            <Select
              // placeholder='Chọn kết quả'
              options={resultTestingOptions}
              defaultValue={true}
              onChange={(e: any, d: any) => setResultTesting(d.value)}
            />
          </Form.Field>

          <Form.Field>
            <label style={{ fontWeight: 'bold' }} className="requiredLabel">
              {t('Confirmatory test code')}
            </label>
            <input
              name="code"
              ref={register({
                required: {
                  value: true,
                  message: t('Confirmatory test code not enterd'),
                },
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
              disabled={!Boolean(resultDate && takenDate && resultTesting)}
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

export default CreateRecencyModal;
