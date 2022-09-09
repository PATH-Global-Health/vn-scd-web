/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  // Image,
  Label,
} from 'semantic-ui-react';
import { FiInfo } from 'react-icons/fi';
import styled from 'styled-components';

import { Link, useHistory } from 'react-router-dom';

import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useAuth, useSelector } from '@app/hooks';

// import logo from '../assets/img/vk-logo.png';
// import packageJson from '../../../package.json';
import { useForm } from 'react-hook-form';
import { LoginModel } from '@app/models/permission';

const StyledCard = styled(Card)`
  width: 450px !important;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
// const StyledImage = styled(Image)`
//   background: white !important;
//   padding: 16px !important;
// `;
const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

const LoginPage: React.FC = () => {
  // const languageOptions = [
  //   { key: 'vn', text: 'Vietnamese', value: 'vn' },
  //   { key: 'en', text: 'English', value: 'en' },
  // ]
  const history = useHistory();
  const { login } = useAuth();
  const { loginLoading } = useSelector((state) => state.auth);
  const [field, setField] = useState('');

  const patternEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const patternPhoneNumber = /^[0-9\b]+$/;

  const { register, handleSubmit, errors, setValue } = useForm();

  const onSubmit = async (data: LoginModel) => {
    try {
      await login(data);
      toast(<ToastComponent content="Đăng nhập thành công" type="success" />);
      setTimeout(() => history.push('/auth'), 0);
    } catch (error) {
      toast(
        <ToastComponent
          content="Sai tên đăng nhập hoặc mật khẩu"
          type="failed"
        />,
      );
    }
  };

  useEffect(() => {
    register({ name: 'email' });
    register({ name: 'phoneNumber' });
    register({ name: 'username' });
    if (field.match(patternEmail)) {
      setValue('email', field);
      setValue('phoneNumber', 'string');
      setValue('username', 'string');
    } else if (field.match(patternPhoneNumber)) {
      setValue('phoneNumber', field);
      setValue('email', 'string');
      setValue('username', 'string');
    } else if (!field.match(patternEmail) && !field.match(patternPhoneNumber)) {
      setValue('username', field);
      setValue('email', 'string');
      setValue('phoneNumber', 'string');
    }
  }, [field, patternEmail, patternPhoneNumber, register, setValue]);

  useEffect(() => {
    window.document.title = 'Facility Management';
  }, []);

  return (
    <StyledCard>
      {/* <StyledImage src={logo} size="large" /> */}
      <Card.Content>
        <Form loading={loginLoading} onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <input
              name="field"
              // required={true}
              ref={register({
                required: {
                  value: true,
                  message: 'Chưa nhập Tên đăng nhập/Email/Số điện thoại',
                },
              })}
              placeholder="Tên đăng nhập/Email/Số điện thoại"
              onChange={(e) => setField(e.target.value)}
            ></input>

            {errors.field && (
              <Label basic color="red" pointing>
                {errors.field.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              ref={register({
                required: { value: true, message: 'Chưa nhập password' },
              })}
            />
            {errors.password && (
              <Label basic color="red" pointing>
                {errors.password.message}
              </Label>
            )}
          </Form.Field>

          {/* <Form.Field>
            <Controller
              name="remember"
              control={control}
              defaultValue={false}
              render={({ onChange, value }): React.ReactElement => (

                <Checkbox
                  label='Nhớ mật khẩu'
                  checked={value || false}
                  onChange={(e, { checked }): void => onChange(checked)}
                />
              )}
            />
          </Form.Field> */}

          <Form.Field>
            <Button fluid primary type="submit" value="Save">
              Đăng nhập
            </Button>
          </Form.Field>
        </Form>
      </Card.Content>
      <Card.Content extra>
        <IconWrapper>
          <FiInfo />
        </IconWrapper>
        {/* {packageJson.version} */}
        {/* <Form.Group widths='equal'> */}
        {/* <Form.Field> */}
        {/* <Dropdown
            className='icon'
            floating
            labeled
            icon='world'
            defaultValue={languageOptions[0].value}
            options={languageOptions}
            search
          /> */}
        {/* </Form.Field> */}
        {/* <Form.Field> */}
        <Link to="/forgot-password">Quên mật khẩu</Link>
        {/* <a
          style={{ float: 'right', paddingRight: '10px' }}
          onClick={() => history.push('/forgotPassword')}
        >
          Quên mật khẩu
        </a> */}
        {/* </Form.Field> */}

        {/* </Form.Group> */}
      </Card.Content>
    </StyledCard>
  );
};

export default LoginPage;
