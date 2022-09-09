import React, { useState } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useSelector } from '@app/hooks';

import serviceService from '../service.service';
import { Service } from '../service.model';
import { useForm } from 'react-hook-form';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface Option {
  key: string;
  value: string;
  text: string;
}

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { register, handleSubmit, errors } = useForm();
  const [serviceFormId, setServiceFormId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [injectionObjectId, setInjectionObjectId] = useState("");
  const onSubmit = async (data: Service) => {
    try {
      await serviceService.createService({ ...data, serviceFormId: serviceFormId, serviceTypeId: serviceTypeId, injectionObjectId: injectionObjectId });
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content="Tạo dịch vụ thành công"
          type="success"
        />,
      );
      setServiceFormId("");
      setServiceTypeId("");
      setInjectionObjectId("");
    } catch (error) {
      toast(
        <ToastComponent
          content="Tạo dịch vụ thất bại"
          type="failed"
        />,
      );
    }
  };
  const serviceTypeList = useSelector(
    (state) => state.csyt.catalog.serviceType.serviceTypeList,
  );
  const injectionObjectList = useSelector(
    (state) => state.csyt.catalog.injectionObject.injectionObjectList,
  );
  const serviceFormList = useSelector(
    (state) => state.csyt.catalog.serviceForm.serviceFormList,
  );

  const serviceTypeListOption = [] as Option[];
  serviceTypeList.map(s => serviceTypeListOption.push({key: s.id, value: s.id, text: s.description}));

  const serviceFormListOption = [] as Option[];
  serviceFormList.map(s => serviceFormListOption.push({key: s.id, value: s.id, text: s.name}));

  const injectionObjectListOption = [] as Option[];
  injectionObjectList.map(s => injectionObjectListOption.push({key: s.id, value: s.id, text: s.name}));

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label>Mã</label>
              <input name="code" ref={register(
                {
                  required: { value: true, message: 'Chưa nhập mã' },
                })} />
              {errors.code &&
                <Label basic color='red' pointing>
                  {errors.code.message}
                </Label>
              }
            </Form.Field>
            <Form.Field>
              <label>Dịch vụ</label>
              <input name="name" ref={register(
                {
                  required: { value: true, message: 'Chưa nhập họ tên' },
                }
              )} />
              {errors.name &&
                <Label basic color='red' pointing>
                  {errors.name.message}
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>Hình thức</label>
              <Select
                options={serviceFormListOption}
                onChange={(e: any, d: any) => setServiceFormId(d.value)}
              />
              {serviceFormId === ""  &&
                <Label basic color='red' pointing>
                  Chưa chọn hình thức
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>Loại hình</label>
              <Select
                options={serviceTypeListOption}
                onChange={(e: any, d: any) => setServiceTypeId(d.value)}
              />
              {serviceTypeId === ""  &&
                <Label basic color='red' pointing>
                  Chưa chọn loại hình
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>Đối tượng</label>
              <Select
                options={injectionObjectListOption}
                onChange={(e: any, d: any) => setInjectionObjectId(d.value)}
              />
              {injectionObjectId === ""  &&
                <Label basic color='red' pointing>
                  Chưa chọn đối tượng
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <Button primary type="submit" value="Save">Xác nhận</Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
