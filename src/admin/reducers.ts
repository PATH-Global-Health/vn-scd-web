import { combineReducers } from '@reduxjs/toolkit';

import manageAccount from './manage-account/slices';
import manageCustomer from './manage-customer/slices';

export default combineReducers({
  account: combineReducers(manageAccount),
  customer: combineReducers(manageCustomer),
});
