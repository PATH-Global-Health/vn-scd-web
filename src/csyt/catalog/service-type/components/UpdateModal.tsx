import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import serviceTypeService from '../service-type.service';
import { ServiceType } from '../service-type.model';

interface Props {
  data?: ServiceType;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<ServiceType>[] = [
  { name: 'id', hidden: true },
  // { name: 'Code', label: 'Mã' },
  { name: 'description', label: 'Tên' },
  { name: 'canChooseDoctor', type: 'checkbox', label: 'Được chọn bác sĩ' },
  { name: 'canChooseHour', type: 'checkbox', label: 'Được chọn giờ' },
  { name: 'canUseHealthInsurance', type: 'checkbox', label: 'Sử dụng BHYT' },
  { name: 'canPostPay', type: 'checkbox', label: 'Thanh toán sau' },
];

const UpdateModal: React.FC<Props> = (props) => {
  const { data, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>Cập nhật</Modal.Header>
        <Modal.Content>
          <SimpleForm
            defaultValues={data}
            formFields={formFields}
            loading={fetching}
            onSubmit={async (d): Promise<void> => {
              await fetch(serviceTypeService.updateServiceType(d));
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default UpdateModal;
