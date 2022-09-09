import { useMemo, useCallback } from 'react';

import moment from 'moment';
import jwtDecode from 'jwt-decode';

import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from '@app/hooks';
import { LoginModel } from '@app/models/permission';
import { AccountInfo } from '@app/models/account-info';
import { ComponentKey } from '@app/utils/component-tree';

import {
  login as li,
  logout as lo,
  getUserInfo,
  setToken,
  getPermissionUI,
} from '../slices/auth';

import { Token } from '../models/token';
import { TOKEN, EXPIRED_TIME } from '../utils/constants';

type UseAuth = {
  isAuthenticated: () => boolean;
  isAdmin: boolean;
  isCBO: boolean;
  isProject: boolean;
  login: (data: LoginModel) => Promise<void>;
  logout: () => void;
  hasPermission: (code: string) => boolean;
  accountInfo: AccountInfo | null;
};

const getStorage = (key: string): string =>
  (localStorage.getItem(key) || sessionStorage.getItem(key)) ?? 'null';

const useAuth = (): UseAuth => {
  const dispatch = useDispatch();

  const isAuthenticated = useCallback((): boolean => {
    const token = JSON.parse(getStorage(TOKEN)) as Token;
    const tokenExpiredTime: Date = new Date(getStorage(EXPIRED_TIME));
    if (token && tokenExpiredTime > new Date()) {
      dispatch(
        setToken({
          token,
          tokenExpiredTime,
          accountInfo: jwtDecode(token?.access_token ?? ''),
        }),
      );
      dispatch(getPermissionUI());
      return true;
    }
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
    return false;
  }, [dispatch]);

  const login = async (data: LoginModel): Promise<void> => {
    const token = unwrapResult(await dispatch(li(data)));
    if (data.remember) {
      localStorage.setItem(TOKEN, JSON.stringify(token));
      localStorage.setItem(
        EXPIRED_TIME,
        moment()
          .add(token.expires_in * 1000, 'seconds')
          .toString(),
      );
    } else {
      sessionStorage.setItem(TOKEN, JSON.stringify(token));
      sessionStorage.setItem(
        EXPIRED_TIME,
        moment()
          .add(token.expires_in * 1000, 'seconds')
          .toString(),
      );
    }
    dispatch(getUserInfo());
  };

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
  }, [dispatch]);

  const { permissionList } = useSelector((state) => state.auth);
  const hasPermission = useCallback(
    (code: string): boolean => {
      return (
        permissionList.map((p) => p.code).includes('ALL') ||
        permissionList.map((p) => p.code).includes(code)
      );
    },
    [permissionList],
  );

  const accountInfo = useSelector((s) => s.auth.accountInfo);
  const isAdmin = useMemo(() => {
    if (
      typeof accountInfo?.Role === 'string' &&
      accountInfo?.Role === 'smd_admin'
    ) {
      return true;
    }
    if (
      Array.isArray(accountInfo?.Role) &&
      accountInfo?.Role.includes('smd_admin')
    ) {
      return true;
    }
    return false;
  }, [accountInfo]);

  const isProject = useMemo(() => {
    if (
      typeof accountInfo?.Role === 'string' &&
      accountInfo?.Role === ComponentKey.SMD_PROJECT.toLowerCase()
    ) {
      return true;
    }
    if (
      Array.isArray(accountInfo?.Role) &&
      accountInfo?.Role.includes(ComponentKey.SMD_PROJECT.toLowerCase())
    ) {
      return true;
    }
    return false;
  }, [accountInfo]);

  const isCBO = useMemo(() => {
    if (
      typeof accountInfo?.Role === 'string' &&
      accountInfo?.Role === ComponentKey.SMD_CBO.toLowerCase()
    ) {
      return true;
    }
    if (
      Array.isArray(accountInfo?.Role) &&
      accountInfo?.Role.includes(ComponentKey.SMD_CBO.toLowerCase())
    ) {
      return true;
    }
    return false;
  }, [accountInfo]);

  return {
    isAuthenticated,
    isAdmin,
    isCBO,
    isProject,
    login,
    logout,
    hasPermission,
    accountInfo,
  };
};

export default useAuth;
