import { ReactText } from 'react';
import { toast } from 'react-toastify';
import { ErrorResponse } from '@smd/models';

import i18next from 'i18next';

const showSuccessToast = (key = ''): ReactText => {
  return toast.success(i18next.t('Success!'), { toastId: key });
};

const showErrorToast = (error: unknown, key = ''): ReactText => {
  const e = error as ErrorResponse;
  const { message, errorMessage } = e.response.data;
  const mes = message || errorMessage;
  if (typeof mes === 'string') {
    return toast.error(mes, { toastId: key });
  }
  return toast.error(mes.map((em) => em).join(';'), { toastId: key });
};

export { showSuccessToast, showErrorToast };
