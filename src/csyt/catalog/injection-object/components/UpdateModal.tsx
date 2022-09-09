import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import injectionObjectService from '../injection-object.service';
import { InjectionObject } from '../injection-object.model';

interface Props {
  data?: InjectionObject;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<InjectionObject>[] = [
  { name: 'id', hidden: true },
  { name: 'name', label: 'Tên' },
  { inputType: 'number', name: 'fromDaysOld', label: 'Từ (ngày tuổi)' },
  { inputType: 'number', name: 'toDaysOld', label: 'Tới (ngày tuổi)' },
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
              await fetch(
                injectionObjectService.updateInjectionObject({
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

export default UpdateModal;
