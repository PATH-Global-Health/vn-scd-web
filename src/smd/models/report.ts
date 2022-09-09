export interface Report {
  id: string;
  period: number;
  dateTime: string;
  value: number;
  indicatorId: string;
  unitId: string;
  cboName: string;
  packageCode?: string;
  province: string;
}

export interface ReportHistory extends Report {
  dateCreated: string;
  dateUpdated: string;
  valueType: number;
  createdMethod: number;
  createBy: string;
}

export interface BarChartResponse {
  indicatorId: string;
  indicatorName?: string;
  label: string;
  data: number;
  target?: number;
  packageCode?: string;
  packageNumber: number;
}

export enum GroupByType {
  PROJECT = 0,
  TIME = 1,
  PROVINCE = 2,
  CBO = 3,
}

export enum ReadType {
  NORMAL = 0,
  RATE = 1,
  PAYMENT = 2,
}

export enum ImportType {
  NORMAL = -1,
  BOTH = 0,
  RAW = 1,
  PAYMENT = 2,
}

export enum AllowImportType {
  SYSTHESIS = 0,
  RAW = 1,
}

export interface EfficiencyRecord {
  projectName: string;
  cboName: string;
  targetValue: number;
  id: string;
  period: number;
  dateTime: string;
  value: number;
  indicatorId: string;
  indicatorName: string;
  indicatorCode: string;
  unitId: string;
  packageCode: string;
  tx_new__1: number;
  tx_new__1Target: number;
  prep_new__2: number;
  prep_new__2Target: number;
  payment: number;
  paymentTarget: number;
  province: string;
}
