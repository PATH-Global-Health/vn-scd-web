import { combineReducers } from '@reduxjs/toolkit';

import catalog from './catalog/reducers';
import workingSchedule from './working-schedule/working-schedule.slice';
import examination from './examination/examination.slice';

export default combineReducers({
  catalog: combineReducers(catalog),
  workingSchedule,
  examination,
});
