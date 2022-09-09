import React, { useState } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useSelector } from '@app/hooks';

import serviceService from '../service.service';
import { Service } from '../service.model';
import { useForm } from 'react-hook-form';

interface Props {
  data?: Service;
  onClose: () => void;
  onRefresh: () => void;
}

interface Option {
  key: string;
  value: string;
  text: string;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { onClose, onRefresh, data } = props;
  const { register, handleSubmit, errors } = useForm();
  const [serviceFormIdS, setServiceFormIdS] = useState(data?.id+"");
  const [serviceTypeIdS, setServiceTypeIdS] = useState(data?.code!);
  const [injectionObjectIdS, setInjectionObjectIdS] = useState(data?.code!);
  const onSubmit = async (data: Service) => {
    try {
      await serviceService.updateService({ ...data, serviceFormId: serviceFormIdS, serviceTypeId: serviceTypeIdS, injectionObjectId: injectionObjectIdS});
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content="Cập nhật dịch vụ thành công"
          type="success"
        />,
      );
      // setServiceFormIdS("");
      // setServiceTypeIdS("");
      // setInjectionObjectIdS("");
    } catch (error) {
      toast(
        <ToastComponent
          content="Cập nhật dịch vụ thất bại"
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
  serviceTypeList.map(s => serviceTypeListOption.push({ key: s.id, value: s.id, text: s.description }));

  const serviceFormListOption = [] as Option[];
  serviceFormList.map(s => serviceFormListOption.push({ key: s.id, value: s.id, text: s.name }));

  const injectionObjectListOption = [] as Option[];
  injectionObjectList.map(s => injectionObjectListOption.push({ key: s.id, value: s.id, text: s.name }));

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label>Mã</label>
              <input name="serviceFormId" hidden ref={register} defaultValue={serviceFormIdS}></input>
              <input name="id" hidden ref={register} defaultValue={data?.id}></input>
              <input name="code" defaultValue={data?.code} ref={register(
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
              <input name="name" defaultValue={data?.name} ref={register(
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
                defaultValue={data?.serviceFormId}
                options={serviceFormListOption}
                onChange={(e: any, d: any) => setServiceFormIdS(d.value)}
              />
              {serviceFormIdS === "" &&
                <Label basic color='red' pointing>
                  Chưa chọn hình thức
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>Loại hình</label>
              <Select
                defaultValue={data?.serviceTypeId}
                options={serviceTypeListOption}
                onChange={(e: any, d: any) => setServiceTypeIdS(d.value)}
              />
              {serviceTypeIdS === "" &&
                <Label basic color='red' pointing>
                  Chưa chọn loại hình
                </Label>
              }
            </Form.Field>

            <Form.Field>
              <label>Đối tượng</label>
              <Select
                defaultValue={data?.injectionObjectId}
                options={injectionObjectListOption}
                onChange={(e: any, d: any) => setInjectionObjectIdS(d.value)}
              />
              {injectionObjectIdS === "" &&
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

export default UpdateModal;
