import { httpClient, apiLinks } from '@app/utils';

import { Token } from '@app/models/token';
import { UserInfo } from '@app/models/user-info';
import {
  ConfirmOTP,
  GenerateOTP,
  LoginModel,
  OptionPassword,
  Permission,
} from '@app/models/permission';
import { toast } from 'react-toastify';

const login = async (data: LoginModel): Promise<Token> => {
  const { email, phoneNumber, password, remember, username } = data;
  const response = await httpClient.post({
    url: apiLinks.auth.token,
    // data: `grant_type=password&username=${username}&password=${password}`,
    data: {
      email: email === 'string' ? null : email,
      username: username === 'string' ? null : username,
      phoneNumber: phoneNumber === 'string' ? null : phoneNumber,
      remember,
      password,
    },
  });
  return response.data as Token;
};

const getUserInfo = async (): Promise<UserInfo> => {
  const response = await httpClient.get({
    url: apiLinks.auth.userInfo,
  });
  return response.data as UserInfo;
};

const getPermissionUI = async (): Promise<Permission[]> => {
  const response = await httpClient.get({
    url: apiLinks.auth.getPermissionUI,
  });
  return response.data as Permission[];
};

const updateUserInfo = async (data: UserInfo): Promise<void> => {
  await httpClient.put({
    url: apiLinks.auth.updateInfo,
    data,
  });
  // return response.data as UserInfo;
};

const changePassword = async (data: OptionPassword): Promise<void> => {
  await httpClient.put({
    url: apiLinks.admin.userManagement.user.resetPassword,
    data,
  });
  // return response.data as UserInfo;
};

const genarateOTP = async (data: GenerateOTP): Promise<void> => {
  await httpClient.post({
    url: apiLinks.admin.userManagement.user.generateOTP,
    data,
  });
  // return response.data as UserInfo;
};

const confirmOTP = async (data: ConfirmOTP): Promise<Token> => {
  const reuslt = await httpClient.post({
    url: apiLinks.admin.userManagement.user.confirmOTP,
    data,
  });

  return reuslt.data as Token;
};

const resetPassword = async (newPassword: string): Promise<void> => {
  await httpClient.post({
    url: apiLinks.admin.userManagement.user.resetPasswordOTP,
    data: {
      newPassword,
    },
  });
  // return response.data as UserInfo;
};

const forgetPassword = async (
  username: string,
  email: string,
): Promise<void> => {
  await httpClient.post({
    url: (al) => al.auth.forgotPassword,
    data: { username, email },
  });
  toast.success(`Xác nhận đổi mật khẩu đã được gửi đến email ${email}`);
};

const setNewPassword = async (
  password: string,
  token: string,
): Promise<void> => {
  try {
    await httpClient.put({
      url: (al) => al.auth.setNewToken,
      data: { password, token },
    });
    toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại!');
  } catch {
    toast.warn('Đổi mật khẩu thất bại');
  }
};

const authService = {
  login,
  getUserInfo,
  updateUserInfo,
  changePassword,
  genarateOTP,
  confirmOTP,
  resetPassword,
  getPermissionUI,
  setNewPassword,
  forgetPassword,
};

export default authService;
