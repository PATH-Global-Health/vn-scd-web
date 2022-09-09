/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo } from 'react';

import {
  Grid,
  Segment,
  Header,
  Card,
  Icon,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Button, Form, Label, Select, TextArea } from 'semantic-ui-react';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';
import { toast } from 'react-toastify';

import { useAddress, useDispatch, useSelector } from '@app/hooks';

import { UserInfo } from '@app/models/user-info';
import { useForm } from 'react-hook-form';
import authService from '@app/services/auth';
import { getUserInfo } from '@app/slices/auth';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { userInfo, getUserInfoLoading: loading } = useSelector((s) => s.auth);

  const {
    province,
    district,
    ward,
    setProvince,
    setDistrict,
    setWard,
    provinceOptions,
    districtOptions,
    wardOptions,
  } = useAddress(userInfo?.province, userInfo?.district, userInfo?.ward);

  const { register, handleSubmit, errors, setValue } = useForm();

  const loadingSection = useMemo(
    () => (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    ),
    [],
  );

  const onSubmit = async (data: UserInfo) => {
    try {
      await authService.updateUserInfo(data);
      dispatch(getUserInfo());
      toast(
        <ToastComponent
          content={t('Successfully updated account information')}
          type="success"
        />,
      );
    } catch (error) {
      toast(
        <ToastComponent
          content={t('Failed update account information')}
          type="failed"
        />,
      );
    }
  };

  useEffect(() => {
    register(
      { name: 'introduction' },
      {
        maxLength: { value: 250, message: t('Maximum 250 characters') },
      },
    );
    setValue('introduction', userInfo?.introduction);
    register(
      { name: 'province' },
      {
        required: {
          value: true,
          message: t('No Province/City selected'),
        },
      },
    );
    setValue('province', userInfo?.province);
    register(
      { name: 'district' },
      {
        required: {
          value: true,
          message: t('No District selected'),
        },
      },
    );
    setValue('district', userInfo?.district);
    register(
      { name: 'ward' },
      {
        required: {
          value: true,
          message: t('No Ward selected'),
        },
      },
    );
    setValue('ward', userInfo?.ward);
  }, [userInfo, register, setValue, t]);

  return (
    <Grid columns={2} stackable className="fill-content">
      <Grid.Row stretched>
        <Grid.Column width={8}>
          <Segment>
            <Header as="h1">{t('Individual')}</Header>
            {loading ? (
              loadingSection
            ) : (
              <>
                <Card fluid>
                  <Card.Content extra>
                    <Card.Header>{userInfo?.name}</Card.Header>
                    <Card.Meta>{userInfo?.address}</Card.Meta>
                    <Card.Description>
                      {userInfo?.introduction}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name="phone" />
                    {userInfo?.phone}
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name="envelope outline" />
                    {userInfo?.email}
                  </Card.Content>
                </Card>
              </>
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment>
            <Header as="h2">{t('Update information')}</Header>
            {loading ? (
              loadingSection
            ) : (
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* <input name="id" hidden defaultValue={data?.id} ref={register}></input> */}
                {/* <input name="username" hidden defaultValue={data?.username} ref={register}></input> */}

                <Form.Field>
                  <label className="requiredLabel">{t('Name')}</label>
                  <input
                    defaultValue={userInfo?.name}
                    name="name"
                    ref={register({
                      required: {
                        value: true,
                        message: t('Facility name not entered'),
                      },
                      minLength: {
                        value: 8,
                        message: t('Minimum 8 characters'),
                      },
                      maxLength: {
                        value: 120,
                        message: t('Maximum 120 characters'),
                      },
                    })}
                  />
                  {errors.name && (
                    <Label basic color="red" pointing>
                      {errors.name.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label className="requiredLabel">{t('Address')}</label>
                  <input
                    defaultValue={userInfo?.address}
                    name="address"
                    ref={register({
                      required: {
                        value: true,
                        message: t('No address entered'),
                      },
                      minLength: {
                        value: 8,
                        message: t('Minimum 8 characters'),
                      },
                      maxLength: {
                        value: 120,
                        message: t('Maximum 120 characters'),
                      },
                    })}
                  />
                  {errors.address && (
                    <Label basic color="red" pointing>
                      {errors.address.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label className="requiredLabel">{t('Province/City')}</label>
                  <Select
                    name="province"
                    fluid
                    search
                    deburr
                    value={province?.value}
                    options={provinceOptions}
                    onChange={(e, { name, value }): void => {
                      setProvince(value as string);
                      setValue(name, value);
                    }}
                  />
                  {errors.province && (
                    <Label basic color="red" pointing>
                      {errors.province.message}
                    </Label>
                  )}
                </Form.Field>
                <Form.Field>
                  <label className="requiredLabel">{t('District')}</label>
                  <Select
                    name="district"
                    fluid
                    search
                    deburr
                    value={district?.value}
                    options={districtOptions}
                    onChange={(e, { name, value }): void => {
                      setDistrict(province?.value as string, value as string);
                      setValue(name, value);
                    }}
                  />
                  {errors.district && (
                    <Label basic color="red" pointing>
                      {errors.district.message}
                    </Label>
                  )}
                </Form.Field>
                <Form.Field>
                  <label className="requiredLabel">{t('Ward')}</label>
                  <Select
                    name="ward"
                    fluid
                    search
                    deburr
                    value={ward?.value}
                    options={wardOptions}
                    onChange={(e, { name, value }): void => {
                      setWard(
                        province?.value as string,
                        district?.value as string,
                        value as string,
                      );
                      setValue(name, value);
                    }}
                  />
                  {errors.ward && (
                    <Label basic color="red" pointing>
                      {errors.ward.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label>{t('Website')}</label>
                  <input
                    defaultValue={userInfo?.website}
                    name="website"
                    ref={register({
                      minLength: {
                        value: 8,
                        message: t('Minimum 8 characters'),
                      },
                      maxLength: {
                        value: 120,
                        message: t('Maximum 120 characters'),
                      },
                    })}
                  />
                  {errors.website && (
                    <Label basic color="red" pointing>
                      {errors.website.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label className="requiredLabel">{t('Phone number')}</label>
                  <input
                    defaultValue={userInfo?.phone}
                    name="phone"
                    ref={register({
                      required: {
                        value: true,
                        message: t('Phone number not enterd'),
                      },
                      minLength: {
                        value: 10,
                        message: t('Minimum 10 numbers'),
                      },
                      maxLength: {
                        value: 11,
                        message: t('Maximum 11 numbers'),
                      },
                      pattern: {
                        value: /^[0-9\b]+$/,
                        message: t('Phone numbers contain digits from 0 -> 9'),
                      },
                    })}
                  />
                  {errors.phone && (
                    <Label basic color="red" pointing>
                      {errors.phone.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label className="requiredLabel">{t('Email')}</label>
                  <input
                    defaultValue={userInfo?.email}
                    name="email"
                    ref={register({
                      required: {
                        value: true,
                        message: t('Email is not enter'),
                      },
                      minLength: {
                        value: 8,
                        message: t('Minimum 8 characters'),
                      },
                      maxLength: {
                        value: 120,
                        message: t('Maximum 120 characters'),
                      },
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: t('Enter the wrong email format'),
                      },
                    })}
                  />
                  {errors.email && (
                    <Label basic color="red" pointing>
                      {errors.email.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <label>{t('Introduction')}</label>
                  <TextArea
                    name="introduction"
                    onChange={(e, { name, value }) => {
                      setValue(name, value);
                    }}
                  >
                    {userInfo?.introduction}
                  </TextArea>
                  {errors.introduction && (
                    <Label basic color="red" pointing>
                      {errors.introduction.message}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <Button primary type="submit" value="Save">
                    {t('Submit')}
                  </Button>
                </Form.Field>
              </Form>
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ProfilePage;
