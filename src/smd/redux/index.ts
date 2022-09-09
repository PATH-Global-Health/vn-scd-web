import { combineReducers } from '@reduxjs/toolkit';

import cbo from './cbo';
import kpi from './kpi';
import smdPackage from './smd-package';
import implementPackage from './implement-package';
import patientInfo from './patient-info';
import project from './project';
import report from './report';
import indicator from './indicator';
import target from './target';
import contract from './contract';

export default combineReducers({
  cbo,
  kpi,
  smdPackage,
  implementPackage,
  project,
  report,
  indicator,
  target,
  contract,
  patientInfo,
});
