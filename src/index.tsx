import React from 'react';
import ReactDOM from 'react-dom';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import App from '@app';

import 'moment/locale/vi';
// eslint-disable-next-line
import 'semantic-ui-less/semantic.less';
import 'react-day-picker/lib/style.css';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    // trackAllPureComponents: true,
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
