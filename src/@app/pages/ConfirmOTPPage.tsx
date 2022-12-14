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
                    content="X??c nh???n m?? OTP th??nh c??ng"
                    type="success"
                />,
            );
            setTimeout(() => history.push('/resetPassword'), 0);
        } catch (error) {
            toast(
                <ToastComponent
                    content="Sai t??n ????ng nh???p ho???c m?? OTP"
                    type="failed"
                />,
            );
        }
    };
    return (
        <StyledCard>
            <Card.Content textAlign="center" header="Nh???p m?? b???o m???t"></Card.Content>
            <Card.Content>
                Vui l??ng ki???m tra m?? trong email c???a b???n. M?? n??y g???m 6 s???.
            </Card.Content>
            <Card.Content>
                <Form
                    loading={confirmOTPLoading}
                    onSubmit={handleSubmit(onSubmit)}>
                    <Form.Field>
                        <input placeholder="Nh???p m??" name="otp" ref={register(
                            {
                                required: { value: true, message: 'Ch??a nh???p m?? OTP' },
                                pattern: {
                                    value: /^[0-9\b]+$/,
                                    message: 'M?? OTP ch???a ch??? s???',
                                },
                                minLength: { value: 6, message: "M?? x??c th???c g???m 6 ch??? s???" },
                                maxLength: { value: 6, message: "M?? x??c th???c g???m 6 ch??? s???" }
                            }
                        )} />
                        {errors.otp &&
                            <Label basic color='red' pointing>
                                {errors.otp.message}
                            </Label>
                        }
                    </Form.Field>
                    <Form.Field>
                        <Button fluid type="submit" value="Save" primary>G???i</Button>
                    </Form.Field>
                    <Form.Field className="field-flex">
                        <Link to="/login">????ng nh???p</Link>
                        <Link to="/forgotPassword">B???n ch??a c?? m?? ?</Link>
                        {/* <a onClick={() => history.push('/login')}>????ng nh???p</a>
                        <a onClick={() => history.push('/forgotPassword')}>B???n ch??a c?? m?? ?</a> */}
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