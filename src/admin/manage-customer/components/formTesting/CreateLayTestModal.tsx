import React, { useState, useEffect } from 'react';
import { Button, Form, Header, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../../manage-customer/services';
import {
  Customer,
  ResultTesting,
  TestingHistoryModel,
} from '../../../manage-customer/models/customer';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@app/components/date-picker';
import { useDispatch, useSelector } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { getDoctors } from '@csyt/catalog/doctor/doctor.slice';
import {
  getTestingHistory,
  setFormType,
} from '@admin/manage-customer/slices/customer';
import { useTranslation } from 'react-i18next';

interface Props {
  // open: boolean;
  onClose: () => void;
  data: Customer;
  formType: number;
  // onRefresh: () => void;
}

const CreateLayTestModal: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const resultTestingOptions = [
    { value: 'Dương tính', text: t('Positive') },
    { value: 'Âm tính', text: t('Negative') },
    { value: 'Không có kết quả', text: t('No result') },
  ];

  const examinationFormOptions = [
    { value: 0, text: t('CBO do test for customer') },
    { value: 1, text: t('Customer test by themself with support') },
    { value: 2, text: t('Customer test by themself without support') },
  ];
  const dispatch = useDispatch();
  const { onClose, formType } = props;
  const { register, handleSubmit, errors } = useForm();
  const [resultTesting, setResultTesting] = useState();
  const [hivPublicExaminationDate, setHivPublicExaminationDate] = useState<
    Date
  >();
  const [examinationForm, setExaminationForm] = useState<number>();
  const { userInfo, token } = useSelector((f) => f.auth);
  const { doctorList } = useSelector((state) => state.csyt.catalog.doctor);

  useEffect(() => {
    dispatch(getDoctors());
  }, [props.data, dispatch]);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
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
          employeeId: selectedDoctor?.id!,
          name: selectedDoctor?.fullName!,
        },
        result: {
          ...data,
          type: 1,
          viralLoad: -1,
          takenDate: 0,
          resultTesting: resultTesting!,
          examinationForm: examinationForm!,
          hivPublicExaminationDate: hivPublicExaminationDate?.getTime()!,
        },
      };
      await customerService.createTestingHistory(LayTest);
      dispatch(setFormType(0));
      dispatch(
        getTestingHistory({
          customerId: props.data.id,
          pageIndex: 1,
          pageSize: 10,
        }),
      );
      setHivPublicExaminationDate(undefined);
      setExaminationForm(undefined);
      setSelectedDoctor(undefined);
      setResultTesting(undefined);
      onClose();
      toast(
        <ToastComponent
          content={t('Successful lay test update')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent content={t('Failed lay test update')} type="failed" />,
      );
    }
  };

  return (
    <Modal
      open={Boolean(formType === 1)}
      onClose={() => {
        onClose();
      }}
    >
      <Modal.Content>
        <Header as="h3">{t('Lay test')}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label style={{ fontWeight: 'bold' }} className="requiredLabel">
            {t('Public HIV examination date')}
          </label>
          <Form.Field
            control={DatePicker}
            onChange={(value: Date) => setHivPublicExaminationDate(value)}
          />

          <Form.Field>
            <label className="requiredLabel">
              {t('Public examination order')}
            </label>
            <input
              name="publicExaminationOrder"
              ref={register({
                required: {
                  value: true,
                  message: t('Public examination order not entered'),
                },
              })}
            />
            {errors.publicExaminationOrder && (
              <Label basic color="red" pointing>
                {errors.publicExaminationOrder.message}
              </Label>
            )}
          </Form.Field>

          <Form.Select
            required
            search
            label={t('Examination form')}
            options={examinationFormOptions.map((d) => ({
              text: d.text,
              value: d.value,
            }))}
            onChange={(e, { value }): void => {
              setExaminationForm(() => parseInt(value + ''));
            }}
          />

          <Form.Field>
            <label className="requiredLabel">{t('Reception code')}</label>
            <input
              name="receptionId"
              ref={register({
                required: {
                  value: true,
                  message: t('Reception code not entered'),
                },
              })}
            />
            {errors.receptionId && (
              <Label basic color="red" pointing>
                {errors.receptionId.message}
              </Label>
            )}
          </Form.Field>

          <Form.Select
            required
            search
            label={t('Staff')}
            options={doctorList
              .filter((d) => d.isDeleted === false)
              .map((d) => ({ text: d.fullName, value: d.id }))}
            onChange={(e, { value }): void => {
              const selected = doctorList.find((d) => d.id === value);
              setSelectedDoctor(selected);
            }}
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
            <label className="requiredLabel">
              {t('Public examination code')}
            </label>
            <input
              name="code"
              ref={register({
                required: {
                  value: true,
                  message: t('Public examination code not entered'),
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
              disabled={
                !Boolean(
                  hivPublicExaminationDate &&
                    selectedDoctor &&
                    (examinationForm || examinationForm === 0) &&
                    resultTesting,
                )
              }
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

export default CreateLayTestModal;
