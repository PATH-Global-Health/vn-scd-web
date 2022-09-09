import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import AppRoute from './AppRoute';

import routes from './routes';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Switch>
      {routes.map((r) => (
        <AppRoute
          key={r.path || '404'}
          path={r.path}
          exact={r.exact}
          component={r.component}
          isPrivate={r.isPrivate}
          layout={r.layout}
        />
      ))}
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
