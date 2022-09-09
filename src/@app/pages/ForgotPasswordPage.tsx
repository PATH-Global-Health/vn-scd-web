/* eslint-disable */
import React from 'react';
import {
  Button,
  Card,
  Form,
  Label,
} from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import { EMAIL_RESET_PASSWORD } from '@app/utils/constants';

import styled from 'styled-components';
import packageJson from '../../../package.json';
import { useForm } from 'react-hook-form';
import { FiInfo } from 'react-icons/fi';
import authService from '@app/services/auth';
import { GenerateOTP } from '@app/models/permission';
import { useHistory } from 'react-router-dom';

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

const ForgotPasswordPage: React.FC = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data: GenerateOTP) => {
    try {
      await authService.genarateOTP(data);
      localStorage.setItem(EMAIL_RESET_PASSWORD, data.email);
      toast(
        <ToastComponent
          content={`Đã gửi mã OTP đến ` + data.email}
          type="success"
        />,
      );
      setTimeout(() => history.push('/confirmOTP'), 0);
    } catch (error) {
      toast(
        <ToastComponent content="Không có kết quả tìm kiếm." type="failed" />,
      );
    }
  };
  return (
    <StyledCard>
      <Card.Content
        textAlign="center"
        header="Tìm tài khoản của bạn"
      ></Card.Content>
      <Card.Content>
        Vui lòng nhập email để tìm kiếm tài khoản của bạn.
      </Card.Content>
      <Card.Content>
        <Form
          // loading={loginLoading}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field>
            <input
              placeholder="Email"
              name="email"
              ref={register({
                required: { value: true, message: 'Chưa nhập email' }, pattern: { value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'Nhập sai định dạng email', },
              })}
            />
            {errors.email && (
              <Label basic color="red" pointing>
                {errors.email.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <Button fluid type="submit" value="Save" primary>
              Gửi
            </Button>
          </Form.Field>
          <Form.Field>
            <a onClick={() => history.push('/login')}>Đăng nhập</a>
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

export default ForgotPasswordPage;
