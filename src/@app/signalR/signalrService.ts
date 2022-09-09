import { Message } from './constantSignalR';
import { useSelector, useDispatch } from '@app/hooks';
import { Redirect, useHistory } from 'react-router-dom';

const SignalrServices = (type: string) => {
  switch (type) {
    case Message.USER_LOGOUT: {
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('EXPIRED_TIME');
      sessionStorage.removeItem('TOKEN');
      sessionStorage.removeItem('EXPIRED_TIME');
      window.location.reload();
      break;
    }
    default: {
      ('Defaut');
      break;
    }
  }
};

export default SignalrServices;
