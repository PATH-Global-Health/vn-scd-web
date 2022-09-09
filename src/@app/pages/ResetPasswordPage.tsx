import React, { useRef } from 'react';
import {
  Button,
  Card,
  Form,
  Label,
} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import styled from 'styled-components';
import packageJson from '../../../package.json';
import { useForm } from 'react-hook-form';
import { FiInfo } from 'react-icons/fi';
import authService from '@app/services/auth';
import {
  TOKEN,
  EXPIRED_TIME,
  EMAIL_RESET_PASSWORD,
} from '@app/utils/constants';

import { RePassword } from '@app/models/permission';
import { Link, useHistory } from 'react-router-dom';

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

const ResetPasswordPage: React.FC = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, watch } = useForm();

  const confirmNewPassword = useRef({});
  confirmNewPassword.current = watch('newPassword', '');

  const onSubmit = async (data: RePassword) => {
    try {
      await authService.resetPassword(data.newPassword);
      toast(
        <ToastComponent content="Đổi mật khẩu thành công" type="success" />,
      );
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(EXPIRED_TIME);
      localStorage.removeItem(EMAIL_RESET_PASSWORD);
      setTimeout(() => history.push('/login'), 0);
    } catch (error) {
      toast(<ToastComponent content="Đổi mật khẩu thất bại" type="failed" />);
    }
  };
  return (
    <StyledCard>
      <Card.Content
        textAlign="center"
        header="Chọn mật khẩu mới"
      ></Card.Content>
      <Card.Content>
        <Form
          // loading={loginLoading}
          onSubmit={handleSubmit(onSubmit)}
        >
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

export default ResetPasswordPage;
