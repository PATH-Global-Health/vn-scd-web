import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { useFetchApi } from '@app/hooks';
import { FormField } from '@app/models/form-field';

import { unitTypeService } from '../../services';
import { UnitType } from '../../models/unit-type';

const fields: FormField<UnitType>[] = [
  {
    name: 'id',
    hidden: true,
  },
  {
    type: 'input',
    name: 'code',
    label: 'Mã',
  },
  {
    type: 'input',
    name: 'typeName',
    label: 'Tên loại hình cơ sở',
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Miêu tả',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  defaultValues?: UnitType;
}

const CreateUpdateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh, defaultValues } = props;

  const { fetch, fetching } = useFetchApi();

  const onSubmit = async (d: UnitType): Promise<void> => {
    if (d.id) {
      await fetch(unitTypeService.updateUnitType(d));
    } else {
      await fetch(unitTypeService.createUnitType(d));
    }
    onClose();
    onRefresh();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <SimpleForm
          loading={fetching}
          formFields={fields}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default CreateUpdateModal;
