import { useDispatch, useSelector } from '@app/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Checkbox, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import { getServices } from '../../../catalog/service/service.slice';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  margin-bottom: 18px;
`;

interface Props {
  selectedIdList: string[];
  onChange: (idList: string[]) => void;
}

const ExaminationServicePicker: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const serviceList = useSelector(
    (state) => state.csyt.catalog.service.serviceList,
  );
  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );
  const [open, setOpen] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const { onChange } = props;

  const dispatch = useDispatch();
  
  const getData = useCallback(() => {
    dispatch(getServices());
  }, [dispatch]);
  useEffect(() => {
    getData();
    onChange(selectedServiceIds);
  }, [getData, onChange, selectedServiceIds]);

  const { selectedIdList } = props;
  return (
    <Wrapper>
      <Button
        basic
        primary
        loading={getServicesLoading}
        content={`${t('Chosen')} ${selectedServiceIds.length} ${t('Service')}`}
        onClick={(): void => setOpen(true)}
      />

      <Modal open={open} size="fullscreen">
        <Modal.Header>{t('Service')}</Modal.Header>
        <Modal.Content>
          <Accordion styled fluid>
            {serviceList.map((io) => (
              <Accordion.Content>
                <React.Fragment key={io.id}>
                  <Checkbox
                    label={io.name}
                    checked={selectedIdList.includes(io.id)}
                    onChange={(e, { checked }): void => {
                      setSelectedServiceIds((l) =>
                        checked
                          ? [...l, io.id]
                          : l.filter((i) => i !== io.id),
                      );
                    }}
                  />
                  <br />
                </React.Fragment>
              </Accordion.Content>
            ))}
          </Accordion>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            content={`${t('Confirm choose ')} ${selectedServiceIds.length} ${t('Service')}`}
            onClick={(): void => setOpen(false)}
          />
        </Modal.Actions>
      </Modal>
    </Wrapper>
  );
};

export default React.memo(ExaminationServicePicker);
