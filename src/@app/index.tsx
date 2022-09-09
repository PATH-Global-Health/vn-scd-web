import React from 'react';

import { Provider } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import './i18n/i18n';

import AppRouter from './routers/AppRouter';
import ErrorModal from './components/ErrorModal';
import ConfirmModal from './components/ConfirmModal';

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <AppRouter />
        <ErrorModal />
        <ConfirmModal />
        <ToastContainer
          hideProgressBar
          position="bottom-center"
          autoClose={3000}
        />
      </Provider>
    </>
  );
};

export default App;
