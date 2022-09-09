import React from 'react';
import './ToastComponent.less';
import classNames from 'classnames';

interface ToastComponentProps {
  content: string;
  type?: 'success' | 'failed';
}

export const ToastComponent: React.FC<ToastComponentProps> = (props) => {
  const { content, type } = props;
  return (
    <React.Fragment>
      <p className={classNames('success', { 'failed': type === 'failed' })}>{content}</p>
    </React.Fragment>
  );
};
