export interface Permission {
  id?: string;
  name?: string;
  code: string;
  description?: string;
}

export interface OptionPassword {
  oldPassword: string;
  newPassword: string;
}

export interface GenerateOTP {
  // username: string;
  email: string;
}

export interface ForgetPassword {
  username: string;
  email: string;
}

export interface ConfirmOTP {
  email: string;
  otp: string;
}

export interface RePassword {
  newPassword: string;
  confirmNewPassword: string;
}

export interface LoginModel {
  username: string;
  password: string;
  remember: boolean;
  email: string;
  phoneNumber: string;
}
