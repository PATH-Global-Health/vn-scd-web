import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import injectionObjectService from '../injection-object.service';
import { InjectionObjectCM } from '../injection-object.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<InjectionObjectCM>[] = [
  { name: 'name', label: 'Tên' },
  { inputType: 'number', name: 'fromDaysOld', label: 'Từ (ngày tuổi)' },
  { inputType: 'number', name: 'toDaysOld', label: 'Tới (ngày tuổi)' },
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
              await fetch(
                injectionObjectService.createInjectionObject({
                  ...d,
                  fromDaysOld: parseInt(`${d?.fromDaysOld ?? ''}`, 10),
                  toDaysOld: parseInt(`${d?.toDaysOld ?? ''}`, 10),
                }),
              );
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
