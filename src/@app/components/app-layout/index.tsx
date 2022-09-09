import React, { ReactNode } from 'react';
import AppBar from './AppBar';

const AppLayout: React.FC<{
  children: ReactNode;
}> = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar />
      {children}
    </>
  );
};

export default AppLayout;
