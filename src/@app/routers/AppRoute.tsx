import React, { ReactNode, useMemo } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks';

interface Props {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  path?: string;
  exact?: boolean;
  isPrivate?: boolean;
}

const AppRoute: React.FC<Props> = (props) => {
  const {
    component: Component,
    layout: Layout,
    path,
    exact,
    isPrivate = false,
  } = props;

  const { isAuthenticated } = useAuth();
  const isAuth = useMemo(() => isAuthenticated(), [isAuthenticated]);

  return (
    <Route
      path={path}
      exact={exact}
      render={(componentProps): JSX.Element => {
        if ((isPrivate && isAuth) || !isPrivate) {
          if (Layout) {
            return (
              <Layout>
                <Component />
              </Layout>
            );
          }
          return <Component />;
        }
        return (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: componentProps.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default AppRoute;
