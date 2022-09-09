import React, { useState } from 'react';
import { Button, Form, Header, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../services';
import {
  Customer,
  LayTestUpdate,
  ReceivedCustomer,
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
  layTestUpdate?: LayTestUpdate;
  onClose: () => void;
  data: Customer | ReceivedCustomer;
  formType: number;
}

const CreateHTSPostModal: React.FC<Props> = (props) => {
  const { layTestUpdate } = props;
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
  const [testingDate, setTestingDate] = useState<Date>();
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
          type: 5,
          viralLoad: -1,
          examinationForm: -1,
          hivPublicExaminationDate: 0,
          resultTesting: resultTesting!,
          resultDate: moment(resultDate).format('YYYY-MM-DD'),
          testingDate: moment(testingDate).format('YYYY-MM-DD'),
        },
      };

      const LayTestUpdate: LayTestUpdate = {
        code: data.code,
        id: layTestUpdate?.id!,
        isDelete: false,
        resultTesting: resultTesting!,
        // takenDate: testingDate?.getTime()!,
        employeeId: layTestUpdate?.employeeId!,
      };
      Boolean(layTestUpdate?.employeeId) &&
        (await customerService.updateLayTest(LayTestUpdate));
      !Boolean(layTestUpdate?.employeeId) &&
        (await customerService.createTestingHistory(LayTest));
      dispatch(
        getTestingHistory({
          customerId: props.data.id,
          pageIndex: 1,
          pageSize: 10,
        }),
      );
      setResultDate(undefined);
      setTestingDate(undefined);
      setResultTesting(undefined);
      onClose();
      toast(
        <ToastComponent
          content={t('Successful confirmatory test update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed confirmatory test update')}
          type="failed"
        />,
      );
    }
  };

  return (
    <Modal open={Boolean(formType === 5)} onClose={onClose}>
      <Modal.Content>
        <Header as="h3">{t('Confirmatory test')}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {!Boolean(layTestUpdate?.employeeId) && (
            <>
              <label style={{ fontWeight: 'bold' }} className="requiredLabel">
                {t('Sample date')}
              </label>
              <Form.Field
                control={DatePicker}
                onChange={(value: Date) => setTestingDate(value)}
              />
            </>
          )}

          {!Boolean(layTestUpdate?.employeeId) && (
            <>
              <label style={{ fontWeight: 'bold' }} className="requiredLabel">
                {t('Result date')}
              </label>
              <Form.Field
                control={DatePicker}
                onChange={(value: Date) => setResultDate(value)}
              />
            </>
          )}

          <Form.Field>
            <label className="requiredLabel">{t('Result')}</label>
            <Select
              // placeholder='Chọn kết quả'
              options={resultTestingOptions}
              defaultValue={layTestUpdate?.resultTesting!}
              onChange={(e: any, d: any) => setResultTesting(d.value)}
            />
          </Form.Field>

          <Form.Field>
            <label style={{ fontWeight: 'bold' }} className="requiredLabel">
              {t('Confirmatory test code')}
            </label>
            <input
              defaultValue={layTestUpdate?.code}
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
              // disabled={!Boolean(resultDate && testingDate && resultTesting)}
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

export default CreateHTSPostModal;
