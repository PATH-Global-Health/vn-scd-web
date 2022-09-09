import React, { useMemo, useState } from 'react';
import { Button, Form, Label, Modal, Select } from 'semantic-ui-react';
import { useSelector, useFetchApi } from '@app/hooks';
import SimpleForm, { Location } from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { customerService } from '../../manage-customer/services';
import { Customer } from '../../manage-customer/models/customer';
import { useForm } from 'react-hook-form';


interface Props {
  open: boolean;
  onClose: () => void;
  data?: Customer;
  onRefresh: () => void;
}

const genderOptions = [
  { key: 'male', value: true, text: 'Nam' },
  { key: 'female', value: false, text: 'Nữ' },
]

const UpdateModal: React.FC<Props> = (props) => {
  const { open, onClose, data, onRefresh } = props;

  const { register, handleSubmit, errors } = useForm();
  const [genderCustomer, setGenderCustomer] = useState(true);
  const onSubmit = async (data: Customer) => {
    try {
      await customerService.updateCustomer({ ...data, gender: genderCustomer });
      onRefresh();
      onClose();
      toast(
        <ToastComponent
          content="Cập nhật khách hàng thành công"
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content="Cập nhật khách hàng thất bại"
          type="failed"
        />,
      );
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Sửa thông tin khách hàng</Modal.Header>
      <Modal.Content>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label className="required">Số điện thoại</label>
            <input name="id" hidden defaultValue={data?.id} ref={register}></input>
            <input name="phoneNumber" defaultValue={data?.phoneNumber} ref={register(
              {
                required: { value: true, message: 'Chưa nhập số điện thoại' },
                minLength: { value: 10, message: 'Số điện thoại tối thiểu 10 số' },
                maxLength: { value: 11, message: 'Số điện thoại tối đa 11 số' },
                pattern: { value: /^[0-9\b]+$/, message: 'Số điện thoại chứa chữ số từ 0 -> 9' }
              }
            )} />
            {errors.phoneNumber &&
              <Label basic color='red' pointing>
                {errors.phoneNumber.message}
              </Label>
            }
          </Form.Field>
          <Form.Field>
            <label className="required">Họ tên</label>
            <input name="fullname" defaultValue={data?.fullname} ref={register(
              {
                required: { value: true, message: 'Chưa nhập họ tên' },
                minLength: { value: 4, message: 'Họ tên tối thiểu 4 ký tự' },
                maxLength: { value: 35, message: 'Họ tên tối đa 35 ký tự' },
              }
            )} />
            {errors.fullname &&
              <Label basic color='red' pointing>
                {errors.fullname.message}
              </Label>
            }
          </Form.Field>
          <Form.Field>
            <label className="required">Giới tính</label>
            <Select
              placeholder='Chọn giới tính'
              options={genderOptions}
              defaultValue={data?.gender}
              onChange={(e: any, d: any) => setGenderCustomer(d.value)}
            />
          </Form.Field>

          <Form.Field>
            <label className="required">Ghi chú</label>
            <input name="identityCard" defaultValue={data?.identityCard} ref={register(
              {
                required: { value: true, message: 'Chưa nhập ghi chú' },
                maxLength: { value: 250, message: 'Ghi chú tối đa 250 ký tự' },
              }
            )} />
            {errors.identityCard &&
              <Label basic color='red' pointing>
                {errors.identityCard.message}
              </Label>
            }
          </Form.Field>

          <Form.Field>
            <Button primary type="submit" value="Save">Xác nhận</Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default UpdateModal;
