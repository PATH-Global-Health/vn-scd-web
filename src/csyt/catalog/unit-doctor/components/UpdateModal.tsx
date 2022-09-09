import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import unitDoctorService from '../unit-doctor.service';
import { UnitDoctor } from '../unit-doctor.model';

interface Props {
  data?: UnitDoctor;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<UnitDoctor>[] = [
  { name: 'id', hidden: true },
  { name: 'name', label: 'Tên' },
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
              await fetch(unitDoctorService.updateUnitDoctor(d));
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
