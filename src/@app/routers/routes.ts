import { ReactNode } from 'react';

import PageNotFound from '@app/pages/PageNotFound';
import LoginPage from '@app/pages/LoginPage';
import AuthPage from '@app/pages/AuthPage';
import HomePage from '@app/pages/HomePage';
import AppLayout from '@app/components/app-layout';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import ConfirmOTPPage from '@app/pages/ConfirmOTPPage';
import ResetPasswordPage from '@app/pages/ResetPasswordPage';
import ForgotPassword2Page from '@app/pages/ForgotPassword2Page';
import ResetPassword2Page from '@app/pages/ResetPassword2Page';

interface Route {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  path?: string;
  exact?: boolean;
  isPrivate?: boolean;
}

const routes: Route[] = [
  {
    component: AuthPage,
    path: '/',
    exact: true,
  },
  {
    component: AuthPage,
    path: '/auth',
  },
  {
    component: LoginPage,
    path: '/login',
  },
  {
    component: HomePage,
    path: '/home',
    layout: AppLayout,
    isPrivate: true,
  },
  {
    component: ForgotPasswordPage,
    path: '/forgotPassword',
    // layout: AppLayout,
    // isPrivate: true,
  },
  {
    component: ForgotPassword2Page,
    path: '/forgot-password',
    // layout: AppLayout,
    // isPrivate: true,
  },
  {
    component: ResetPassword2Page,
    path: '/reset-password',
    // layout: AppLayout,
    // isPrivate: true,
  },
  {
    component: ConfirmOTPPage,
    path: '/confirmOTP',
    // layout: AppLayout,
    // isPrivate: true,
  },
  {
    component: ResetPasswordPage,
    path: '/resetPassword',
    // layout: AppLayout,
    isPrivate: true,
  },
  {
    component: PageNotFound,
  },
];

export default routes;
