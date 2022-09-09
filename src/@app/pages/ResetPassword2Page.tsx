/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useRef } from 'react';
import styled from 'styled-components';

import { Button, Card, Form, Label } from 'semantic-ui-react';

import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiInfo } from 'react-icons/fi';

import { useQuery } from '@app/hooks';
import authService from '@app/services/auth';
import { RePassword } from '@app/models/permission';

import packageJson from '../../../package.json';

const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

const StyledCard = styled(Card)`
  width: 450px !important;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ResetPassword2Page: React.FC = () => {
  const history = useHistory();
  const query = useQuery();

  const { register, handleSubmit, errors, watch } = useForm<{
    newPassword: string;
    confirmNewPassword: string;
  }>();

  const confirmNewPassword = useRef({});
  confirmNewPassword.current = watch('newPassword', '');

  const onSubmit = async (data: RePassword) => {
    await authService.setNewPassword(
      data.newPassword,
      query?.get('token') ?? '',
    );
    setTimeout(() => history.push('/login'), 0);
  };
  return (
    <StyledCard>
      <Card.Content textAlign="center" header="Nhập mật khẩu mới" />
      <Card.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              ref={register({
                required: { value: true, message: 'Chưa nhập mật khẩu mới' },
              })}
            />
            {errors.newPassword && (
              <Label basic color="red" pointing>
                {errors.newPassword.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmNewPassword"
              ref={register({
                required: { value: true, message: 'Chưa nhập mật khẩu mới' },
                validate: (value) =>
                  value === confirmNewPassword.current ||
                  'Mật khẩu mới không khớp',
              })}
            />
            {errors.confirmNewPassword && (
              <Label basic color="red" pointing>
                {errors.confirmNewPassword.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <Button fluid type="submit" value="Save" primary>
              Gửi
            </Button>
          </Form.Field>
          <Form.Field>
            <Link to="/login">Đăng nhập</Link>
            {/* <a href="#" onClick={() => history.push('/login')}>Đăng nhập</a> */}
          </Form.Field>
        </Form>
      </Card.Content>
      <Card.Content extra>
        <IconWrapper>
          <FiInfo />
        </IconWrapper>
        {packageJson.version}
      </Card.Content>
    </StyledCard>
  );
};

export default ResetPassword2Page;
