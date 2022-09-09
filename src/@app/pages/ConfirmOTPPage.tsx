import React, { useEffect } from 'react';
import { Button, Card, Form, Label } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';
import { TOKEN, EXPIRED_TIME, EMAIL_RESET_PASSWORD } from '@app/utils/constants';

import styled from 'styled-components';
import packageJson from '../../../package.json';
import { useForm } from 'react-hook-form';
import { FiInfo } from 'react-icons/fi';
import { ConfirmOTP } from '@app/models/permission';
import { Link, useHistory } from 'react-router-dom';
import { confirmOTP } from '@app/slices/auth';
import { useDispatch } from '@app/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import { useSelector } from '@app/hooks';

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



const ConfirmOTPPage: React.FC = () => {
    const history = useHistory();
    const { confirmOTPLoading } = useSelector((state) => state.auth)
    const { register, handleSubmit, errors, setValue } = useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        const emailResetPass = localStorage.getItem(EMAIL_RESET_PASSWORD);
        if (emailResetPass) {
            register({ name: "email" });
            setValue("email", emailResetPass);
        } else {
            history.push('/forgotPassword');
        }
    })

    const onSubmit = async (data: ConfirmOTP) => {
        try {
            const token = unwrapResult(await dispatch(confirmOTP(data)));
            localStorage.setItem(TOKEN, JSON.stringify(token));
            localStorage.setItem(
                EXPIRED_TIME,
                moment()
                    .add(token.expires_in * 1000, 'seconds')
                    .toString(),
            );
            toast(
                <ToastComponent
                    content="Xác nhận mã OTP thành công"
                    type="success"
                />,
            );
            setTimeout(() => history.push('/resetPassword'), 0);
        } catch (error) {
            toast(
                <ToastComponent
                    content="Sai tên đăng nhập hoặc mã OTP"
                    type="failed"
                />,
            );
        }
    };
    return (
        <StyledCard>
            <Card.Content textAlign="center" header="Nhập mã bảo mật"></Card.Content>
            <Card.Content>
                Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 số.
            </Card.Content>
            <Card.Content>
                <Form
                    loading={confirmOTPLoading}
                    onSubmit={handleSubmit(onSubmit)}>
                    <Form.Field>
                        <input placeholder="Nhập mã" name="otp" ref={register(
                            {
                                required: { value: true, message: 'Chưa nhập mã OTP' },
                                pattern: {
                                    value: /^[0-9\b]+$/,
                                    message: 'Mã OTP chứa chữ số',
                                },
                                minLength: { value: 6, message: "Mã xác thực gồm 6 chữ số" },
                                maxLength: { value: 6, message: "Mã xác thực gồm 6 chữ số" }
                            }
                        )} />
                        {errors.otp &&
                            <Label basic color='red' pointing>
                                {errors.otp.message}
                            </Label>
                        }
                    </Form.Field>
                    <Form.Field>
                        <Button fluid type="submit" value="Save" primary>Gửi</Button>
                    </Form.Field>
                    <Form.Field className="field-flex">
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/forgotPassword">Bạn chưa có mã ?</Link>
                        {/* <a onClick={() => history.push('/login')}>Đăng nhập</a>
                        <a onClick={() => history.push('/forgotPassword')}>Bạn chưa có mã ?</a> */}
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
    )
}

export default ConfirmOTPPage;