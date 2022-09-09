import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import unitDoctorService from '../unit-doctor.service';
import { UnitDoctorCM } from '../unit-doctor.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<UnitDoctorCM>[] = [{ name: 'name', label: 'Tên' }];

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
              await fetch(unitDoctorService.createUnitDoctor(d));
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
