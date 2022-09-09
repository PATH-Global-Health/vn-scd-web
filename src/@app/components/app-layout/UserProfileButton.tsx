import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Header,
  Icon,
  Label,
  Modal,
  Popup,
} from 'semantic-ui-react';
import { FiLogOut, FiUser, FiInfo } from 'react-icons/fi';
import { IoLanguageSharp } from 'react-icons/io5';
import { CgPassword } from 'react-icons/cg';
import styled from 'styled-components';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useHistory } from 'react-router-dom';

import { useAuth, useSelector, useDispatch } from '@app/hooks';
import { getUserInfo } from '@app/slices/auth';

import packageJson from '../../../../package.json';
import { useForm } from 'react-hook-form';
import { OptionPassword } from '@app/models/permission';
import authService from '../../services/auth';
import { setLanguageGlobal } from '@app/slices/auth';
import { useTranslation } from 'react-i18next';

const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;
const icon = (i: React.ReactNode): React.ReactNode => (
  <IconWrapper>{i}</IconWrapper>
);

const UserProfileButton: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userInfo, getUserInfoLoading } = useSelector((state) => state.auth);
  const { register, handleSubmit, errors, watch } = useForm();

  const confirmNewPassword = useRef({});
  confirmNewPassword.current = watch('newPassword', '');

  const { logout } = useAuth();
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [language, setLanguage] = useState('en');

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserInfo());
    }
  }, [dispatch, userInfo]);

  const fullName = useMemo(
    (): string =>
      userInfo?.name ?? userInfo?.email ?? userInfo?.username ?? 'Loading...',
    [userInfo],
  );

  const onSubmit = async (data: OptionPassword) => {
    try {
      await authService.changePassword(data);
      setShowModal(false);
      // setValue('province', undefined);
      // setValue('district', undefined);
      // setValue('ward', undefined);
      // setValue('unitTypeId', undefined);
      // setValue('introduction', undefined);
      // setProvince("");
      // onRefresh();
      // onClose();
      toast(
        <ToastComponent
          content={t('Change password successfully')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent content={t('Change password failed')} type="failed" />,
      );
    }
  };

  return (
    <>
      <Popup
        pinned
        inverted
        size="mini"
        position="bottom right"
        content={fullName}
        trigger={
          <Dropdown
            className="link item"
            icon={<FiUser style={{ marginLeft: 8 }} />}
            text={`${fullName.substring(0, 10)}...`}
            loading={getUserInfoLoading}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(): void => {
                  setShowModalLogout(true);
                }}
                content={t('Logout')}
                icon={icon(<FiLogOut />)}
              />
              <Dropdown.Item
                onClick={(): void => {
                  setShowModal(true);
                  // setTimeout(() => {
                  //   history.push('/');
                  //   window.location.reload();
                  // }, 0);
                }}
                content={t('Change Password')}
                icon={icon(<CgPassword />)}
              />

              <Dropdown.Divider />
              <Dropdown.Item
                disabled
                content={packageJson.version}
                icon={icon(<FiInfo />)}
              />
            </Dropdown.Menu>
          </Dropdown>
        }
      />

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>{t('Change Password')}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label>{t('Password')}</label>
              <input
                type="password"
                name="oldPassword"
                ref={register({
                  required: { value: true, message: t('Password not entered') },
                  maxLength: { value: 20, message: t('Maximum 20 characters') },
                  minLength: { value: 8, message: t('Minimum 8 characters') },
                })}
              />
              {errors.oldPassword && (
                <Label basic color="red" pointing>
                  {errors.oldPassword.message}
                </Label>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('New password')}</label>
              <input
                type="password"
                name="newPassword"
                ref={register({
                  required: { value: true, message: t('Password not entered') },
                  maxLength: { value: 20, message: t('Maximum 20 characters') },
                  minLength: { value: 8, message: t('Minimum 8 characters') },
                })}
              />
              {errors.newPassword && (
                <Label basic color="red" pointing>
                  {errors.newPassword.message}
                </Label>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Confirm password')}</label>
              <input
                type="password"
                name="confirmNewPassword"
                ref={register({
                  required: { value: true, message: t('Password not entered') },
                  maxLength: { value: 20, message: t('Maximum 20 characters') },
                  minLength: { value: 8, message: t('Minimum 8 characters') },
                  validate: (value) =>
                    value === confirmNewPassword.current ||
                    t('Password incorrect') + '',
                })}
              />
              {errors.confirmNewPassword && (
                <Label basic color="red" pointing>
                  {errors.confirmNewPassword.message}
                </Label>
              )}
            </Form.Field>
            <Form.Field>
              <Button type="submit" value="Save" primary>
                {t('Submit')}
              </Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>

      <Modal
        basic
        open={showModalLogout}
        onClose={() => setShowModalLogout(false)}
      >
        <Header icon>
          <Icon name="log out" />
          {t('Are you sure you want to sign out?')}
        </Header>
        <Modal.Content></Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setShowModalLogout(false)}
          >
            <Icon name="remove" /> {t('Cancel')}
          </Button>
          <Button
            color="green"
            inverted
            onClick={() => {
              logout();
              setTimeout(() => {
                history.push('/');
                window.location.reload();
              }, 0);
              setShowModalLogout(false);
            }}
          >
            <Icon name="checkmark" /> {t('Submit')}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default React.memo(UserProfileButton);
