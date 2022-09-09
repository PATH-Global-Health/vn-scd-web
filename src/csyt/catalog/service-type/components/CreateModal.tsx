import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import serviceTypeService from '../service-type.service';
import { ServiceTypeCM } from '../service-type.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<ServiceTypeCM>[] = [
  // { name: 'Code', label: 'Mã' },
  { name: 'description', label: 'Tên' },
  { name: 'canChooseDoctor', type: 'checkbox', label: 'Được chọn bác sĩ' },
  { name: 'canChooseHour', type: 'checkbox', label: 'Được chọn giờ' },
  { name: 'canUseHealthInsurance', type: 'checkbox', label: 'Sử dụng BHYT' },
  { name: 'canPostPay', type: 'checkbox', label: 'Thanh toán sau' },
];

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <SimpleForm
            formFields={formFields}
            loading={fetching}
            onSubmit={async (d): Promise<void> => {
              await fetch(serviceTypeService.createServiceType(d));
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
