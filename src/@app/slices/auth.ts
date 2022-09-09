import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import authService from '@app/services/auth';

import { Token } from '@app/models/token';
import { UserInfo } from '@app/models/user-info';
import { ConfirmOTP, LoginModel, Permission } from '@app/models/permission';
import { AccountInfo } from '@app/models/account-info';

interface State {
  token: Token | null;
  tokenExpiredTime: Date | null;
  accountInfo: AccountInfo | null;
  loginLoading: boolean;
  confirmOTPLoading: boolean;
  userInfo: UserInfo | null;
  getUserInfoLoading: boolean;
  permissionList: Permission[];
  language: string;
}

const initialState: State = {
  token: null,
  tokenExpiredTime: null,
  loginLoading: false,
  confirmOTPLoading: false,
  userInfo: null,
  accountInfo: null,
  getUserInfoLoading: false,
  permissionList: [],
  language: '',
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const login = createAsyncThunk('auth/login', async (data: LoginModel) => {
  // const { username, password, email, phoneNumber } = arg;
  const result = await authService.login(data);
  return result;
});

const setTokenCR: CR<{
  token: Token;
  tokenExpiredTime: Date;
  accountInfo: unknown;
}> = (state, action) => ({
  ...state,
  token: action.payload.token,
  tokenExpiredTime: action.payload.tokenExpiredTime,
  accountInfo: action.payload.accountInfo as AccountInfo,
});

const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  const result = await authService.getUserInfo();
  window.document.title = result.name || result.username;
  return result;
});

const getPermissionUI = createAsyncThunk('auth/getPermissionUI', async () => {
  const result = await authService.getPermissionUI();
  return result;
});

const confirmOTP = createAsyncThunk(
  'auth/confirmOTP',
  async (data: ConfirmOTP) => {
    const result = await authService.confirmOTP(data);
    return result;
  },
);

const logoutCR: CR<void> = () => ({
  ...initialState,
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: setTokenCR,
    logout: logoutCR,
    setLanguageGlobal: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => ({
      ...state,
      loginLoading: true,
    }));
    builder.addCase(login.fulfilled, (state, { payload }) => {
      const { username } = payload;
      return {
        ...state,
        loginLoading: false,
        token: payload,
        tokenExpiredTime: new Date(
          new Date().getTime() + payload.expires_in * 1000,
        ),
        permissionList:
          username === '1'
            ? [{ code: 'ADMIN' }, { code: 'CSYT_CATALOG' }]
            : initialState.permissionList,
      };
    });
    builder.addCase(login.rejected, (state) => ({
      ...state,
      loginLoading: false,
    }));

    // confirm OTP
    builder.addCase(confirmOTP.pending, (state) => ({
      ...state,
      confirmOTPLoading: true,
    }));
    builder.addCase(confirmOTP.fulfilled, (state, { payload }) => {
      // const { username } = payload;
      return {
        ...state,
        confirmOTPLoading: false,
        token: payload,
        tokenExpiredTime: new Date(
          new Date().getTime() + payload.expires_in * 1000,
        ),
        // permissionList:
        //   username === '1'
        //     ? [{ code: 'ADMIN' }, { code: 'CSYT_CATALOG' }]
        //     : initialState.permissionList,
      };
    });
    builder.addCase(confirmOTP.rejected, (state) => ({
      ...state,
      confirmOTPLoading: false,
    }));

    // get user info
    builder.addCase(getUserInfo.pending, (state) => ({
      ...state,
      getUserInfoLoading: true,
    }));
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => ({
      ...state,
      userInfo: payload,
      getUserInfoLoading: false,
    }));
    builder.addCase(getUserInfo.rejected, (state) => ({
      ...state,
      getUserInfoLoading: false,
    }));

    builder.addCase(getPermissionUI.pending, (state) => ({
      ...state,
      // getUserInfoLoading: true,
    }));
    builder.addCase(getPermissionUI.fulfilled, (state, { payload }) => ({
      ...state,
      permissionList: payload,
      // getUserInfoLoading: false,
    }));
    builder.addCase(getPermissionUI.rejected, (state) => ({
      ...state,
      // getUserInfoLoading: false,
    }));
  },
});

export { login, getUserInfo, confirmOTP, getPermissionUI };
export const { setToken, logout, setLanguageGlobal } = slice.actions;

export default slice.reducer;
