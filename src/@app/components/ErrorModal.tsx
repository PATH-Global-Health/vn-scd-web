import React from 'react';
import { Modal, Header, Button, Table } from 'semantic-ui-react';
import { FiX, FiXCircle } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { clearErrorCallback } from '@app/slices/global';
import { useTranslation } from 'react-i18next';

const StyledIconWrapper = styled.span`
  line-height: 0;
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
`;
const Message = styled.p`
  font-size: 30px;
`;

const ErrorModal: React.FC = () => {
  const { t } = useTranslation();
  const { error } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const { title, message, callback } = error ?? {};

  return (
    <Modal basic size="small" open={Boolean(callback) && Boolean(message)}>
      <Header
        content={title}
        icon={
          <StyledIconWrapper>
            <FiXCircle />
          </StyledIconWrapper>
        }
      />
      <Modal.Content>
        <h4>Danh sách lỗi</h4>
        {message?.includes('\n') ? (
          <Table size="small" inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Chi tiết lỗi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {(message ?? '').split('\n').map((e: string, i: number) => {
                if (message.split('\n').length === i + 1) {
                  return null;
                }
                return (
                  <Table.Row key={e}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{e}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <Message>{message}</Message>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          inverted
          color="red"
          content={t('Cancel')}
          icon={
            <StyledIconWrapper>
              <FiX />
            </StyledIconWrapper>
          }
          onClick={(): void => {
            if (callback) {
              callback();
            }
            dispatch(clearErrorCallback());
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default React.memo(ErrorModal);
