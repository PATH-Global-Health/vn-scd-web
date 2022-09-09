export interface PatientInfo {
  id: string;
  psnu: string;
  moPName: string;
  cboName: string;
  cboCode: string;
  supporterName: string;
  reachCode: string;
  layTestingCode: string;
  htcTestCode: string;
  htcSite: string;
  testResult: string;
  dateOfTesting: Date;
  serviceName: string;
  clientID: string;
  facilityName: string;
  dateOfReferral: Date;
  referralSlip: string;
  newCase: string;
  dateOfVerification: Date;
  reportingPeriod: Date;
  updatedDate: Date;
  note: string;
}

export interface PatientInfoHistory extends PatientInfo {
  dateUpdated: string;
  dateCreated: string;
  createdBy: string;
  createdMethod: string;
}
