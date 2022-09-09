/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Header, Label, Segment, Select } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import { ToastComponent } from '@app/components/toast-component/ToastComponent';

import { toast } from 'react-toastify';

import {
    Customer,
} from '../../../../models/customer';
import { useForm } from 'react-hook-form';
import { getCustomerById } from '@admin/manage-customer/slices/customer';
import customerService from '@admin/manage-customer/services/customer';
import { useTranslation } from 'react-i18next';
import {
    useAddress,

} from '@app/hooks';
import { DatePicker } from '@app/components/date-picker';
import moment from 'moment';

interface Props {
    onRefresh: () => void;
}

const InfomationPane: React.FC<Props> = (props) => {
    const { t } = useTranslation();
    const { customer, getCustomersLoading } = useSelector(c => c.admin.customer.customer);
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const genderOptions = [
        { key: 'male', value: true, text: t('Male') },
        { key: 'female', value: false, text: t('Female') },
    ];

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
    } = useAddress(customer?.province, customer?.district, customer?.ward);
    const dispatch = useDispatch();

    const { register, handleSubmit, errors, setValue } = useForm();
    const [genderCustomer, setGenderCustomer] = useState(true);
    const onSubmit = async (data: Customer) => {
        try {
            
            await customerService.updateCustomer({ ...data, gender: genderCustomer, dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD') });
            await dispatch(getCustomerById(customer?.id!));
            // onClose();
            props.onRefresh();
            toast(
                <ToastComponent
                    content={t('Successful customer update')}
                    type="success"
                />,
            );
        } catch (error) {
            toast(
                <ToastComponent
                    content={t('Failed customer update')}
                    type="failed"
                />,
            );
        }
    };

    useEffect(() => {
        register({ name: "introduction" }, {
            maxLength: { value: 250, message: t('Maximum 250 characters') },
        });
        // setValue('introduction', userInfo?.introduction);
        register({ name: "province" }, {
            required: {
                value: true,
                message: t('No Province/City selected')
            },
        });
        setValue('province', customer?.province);
        register({ name: "district" }, {
            required: {
                value: true,
                message: t('No District selected')
            },
        });
        setValue('district', customer?.district);
        register({ name: "ward" }, {
            required: {
                value: true,
                message: t('No Ward selected')
            },
        });
        setValue('ward', customer?.ward);
    }, [customer, register, setValue, t]);

    return (
        <>
            <Grid columns={2} stackable className="fill-content">
                <Grid.Row stretched>
                    {/* <Grid.Column width={8}> */}
                    {/* <Card fluid>
                            <Card.Content extra>
                                <Card.Header>{t('Customer information')}</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name="info" />
                                {customer?.fullname}
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name="phone" />
                                {customer?.phoneNumber}
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name="other gender horizontal" />
                                {customer?.gender === false ? t('Female') : t('Male')}
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name="sticky note" />
                                {customer?.identityCard}
                            </Card.Content>
                        </Card> */}
                    {/* </Grid.Column> */}
                    <Grid.Column width={16}>
                        <Segment>
                            <Header as="h2">{t('Update information')}</Header>
                            <Form loading={getCustomersLoading} onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('PhoneNumber')}</label>
                                        <input name="id" hidden defaultValue={customer?.id} ref={register}></input>
                                        <input name="phoneNumber" defaultValue={customer?.phoneNumber} ref={register(
                                            {
                                                required: { value: true, message: t('No phone number entered') },
                                                minLength: { value: 10, message: t('Phone numbers with minnimun is 10 digits') },
                                                maxLength: { value: 11, message: t('Phone numbers with up to 11 digits') },
                                                pattern: { value: /^[0-9\b]+$/, message: t('Phone numbers contain digits from 0 -> 9') }
                                            }
                                        )} />
                                        {errors.phoneNumber &&
                                            <Label basic color='red' pointing>
                                                {errors.phoneNumber.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('Name')}</label>
                                        <input name="fullname" defaultValue={customer?.fullname} ref={register(
                                            {
                                                required: { value: true, message: t('No customer name entered') },
                                                minLength: { value: 4, message: t('Minimum 4 characters') },
                                                maxLength: { value: 35, message: t('Maximum 35 characters') },
                                            }
                                        )} />
                                        {errors.fullname &&
                                            <Label basic color='red' pointing>
                                                {errors.fullname.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('Gender')}</label>
                                        <Select
                                            // placeholder='Chọn giới tính'
                                            options={genderOptions}
                                            defaultValue={customer?.gender}
                                            onChange={(e: any, d: any) => setGenderCustomer(d.value)}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <label className="requiredLabel">{t('Identity card')}</label>
                                        <input name="identityCard" defaultValue={customer?.identityCard} ref={register(
                                            {
                                                required: { value: true, message: t('No identity card entered') },
                                                minLength: { value: 9, message: t('Minimum 8 characters') },
                                                maxLength: { value: 12, message: t('Maximum 12 characters') },
                                                pattern: { value: /^[0-9\b]+$/, message: t('Identity card contain digits from 0 -> 9') }
                                            }
                                        )} />
                                        {errors.identityCard &&
                                            <Label basic color='red' pointing>
                                                {errors.identityCard.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('Address')}</label>
                                        <input defaultValue={customer?.address} name="address" ref={register(
                                            {
                                                required: { value: true, message: t('No address entered') },
                                                minLength: { value: 8, message: t('Minimum 8 characters') },
                                                maxLength: { value: 120, message: t('Maximum 120 characters') }
                                            }
                                        )} />
                                        {errors.address &&
                                            <Label basic color='red' pointing>
                                                {errors.address.message}
                                            </Label>
                                        }
                                    </Form.Field>

                                    <Form.Field>
                                        <label>{t('Email')}</label>
                                        <input defaultValue={customer?.email} name="email" ref={register(
                                            {
                                                // required: { value: true, message: t('Email is not enter') },
                                                minLength: { value: 8, message: t('Minimum 8 characters') },
                                                maxLength: { value: 120, message: t('Maximum 120 characters') },
                                                pattern: { value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: t('Enter the wrong email format') }
                                            }
                                        )} />
                                        {errors.email &&
                                            <Label basic color='red' pointing>
                                                {errors.email.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        label={t('Date of birth')}
                                        control={DatePicker}
                                        value={moment(customer?.dateOfBirth).format('YYYY-MM-DD')}
                                        onChange={(value: Date) => setDateOfBirth(value)}
                                    />
                                    <Form.Field>
                                        <label className="requiredLabel">{t('Province/City')}</label>
                                        <Select
                                            name='province'
                                            fluid
                                            search
                                            deburr
                                            value={province?.value}
                                            options={provinceOptions}
                                            onChange={(e, { name, value }): void => {
                                                setProvince(value as string);
                                                setValue(name, value)
                                            }}
                                        />
                                        {errors.province &&
                                            <Label basic color='red' pointing>
                                                {errors.province.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('District')}</label>
                                        <Select
                                            name='district'
                                            fluid
                                            search
                                            deburr
                                            value={district?.value}
                                            options={districtOptions}
                                            onChange={(e, { name, value }): void => {
                                                setDistrict(province?.value as string, value as string);
                                                setValue(name, value)
                                            }}
                                        />
                                        {errors.district &&
                                            <Label basic color='red' pointing>
                                                {errors.district.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                    <Form.Field>
                                        <label className="requiredLabel">{t('Ward')}</label>
                                        <Select
                                            name='ward'
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
                                        {errors.ward &&
                                            <Label basic color='red' pointing>
                                                {errors.ward.message}
                                            </Label>
                                        }
                                    </Form.Field>
                                </Form.Group>

                                <Form.Field>
                                    <Button primary type="submit" value="Save">{t('Submit')}</Button>
                                </Form.Field>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default InfomationPane;
