import { Hospital } from "@admin/manage-account/models/hospital"

export interface Customer {
  readonly id: string;
  externalId: string;
  identityCard: string;
  fullname: string;
  phone?: string;
  phoneNumber: string;
  gender: boolean;
  dateOfBirth?: string;
  email?: string;
  address?: string;
  district?: string;
  province?: string;
  ward?: string;
  districtCode?: string;
  provinceCode?: string;
  wardCode?: string;
  birthDate?: string;
  note?: string;
  isDeleted?: boolean;
}

export interface TestingHistory {
  id: string;
  dateCreate: string;
  dateUpdate: string;
  employeeName: string;
  type: number;
  hivPublicExaminationDate: number,
  publicExaminationOrder: string,
  examinationForm: number,
  receptionId: string,
  takenDate: number,
  testingDate: string,
  resultDate: string,
  resultTesting: string,
  viralLoad: number,
  code: string,
  employeeId?: string,
}



export interface PrEPHistory {
  id: string;
  isDelete: boolean;
  startDate: string;
  code: string;
  reportDate: string;
  timingLate: string,
  status: string,
  isLate: number,
  cdO_Employee?: Employee,
}

export interface PrEP_ERP_History {
  id: string;
  date: string;
  unitId: string;
  codeTest: string;
}

export interface App {
  appId: string;
  name: string;
}

export interface Facility {
  facilityId: string;
  name: string;
}

export interface Employee {
  employeeId: string;
  name: string;
}

export interface ResultTesting {
  type: number,
  hivPublicExaminationDate: number,
  publicExaminationOrder: string,
  examinationForm: number,
  receptionId: string,
  takenDate: number,
  testingDate: string,
  resultDate: string,
  resultTesting: string,
  viralLoad: number,
  code: string
}

export interface TestingHistoryModel {
  app: App;
  facility: Facility;
  customer: Customer | null;
  cdO_Employee: Employee;
  result: ResultTesting;
}

export interface TestingHistorySlice {
  pageIndex: number,
  pageSize: number,
  totalPage: number,
  totalSize: number,
  data: TestingHistoryDataSlice[],
}

export interface TestingHistoryDataSlice extends TestingHistoryModel {
  id: string;
  isDelete: boolean;
}

export const formTypeTesting = [
  {
    key: 'LAY_TEST',
    text: 'Xét nghiệm sàng lọc',
    value: 1,
  },
  {
    key: 'VIRAL_LOAD',
    text: 'Xét nghiệm tải lượng virut',
    value: 2,
  },
  {
    key: 'CD4',
    text: 'Xét nghiệm CD4',
    value: 3,
  },
  {
    key: 'RECENCY',
    text: 'Xét nghiệm khẳng định nhiễm mới',
    value: 4,
  },
  {
    key: 'HTS_POS',
    text: 'Xét nghiệm khẳng định',
    value: 5,
  },

]

export const formTypeFilter = [
  {
    key: 'ALL',
    text: 'Tất cả',
    value: 0,
  },
  {
    key: 'LAY_TEST',
    text: 'Xét nghiệm sàng lọc',
    value: 1,
  },
  {
    key: 'VIRAL_LOAD',
    text: 'Xét nghiệm tải lượng virut',
    value: 2,
  },
  {
    key: 'CD4',
    text: 'Xét nghiệm CD4',
    value: 3,
  },
  {
    key: 'RECENCY',
    text: 'Xét nghiệm khẳng định',
    value: 5,
  },
  {
    key: 'HTS_POS',
    text: 'Xét nghiệm khẳng định nhiễm mới',
    value: 4,
  },

]

export const formTypePrEP = [
  {
    key: 'PrEP_FORM',
    text: 'Tiếp nhận điều trị',
    value: 6,
  },
  {
    key: 'TX_ML_FORM',
    text: 'Cập nhật thông tin bỏ trị',
    value: 7,
  },


]

export const formTypeART = [
  {
    key: 'ART_FORM',
    text: 'Tiếp nhận điều trị',
    value: 8,
  },
  {
    key: 'TX_ML_ART_FORM',
    text: 'Cập nhật thông tin bỏ trị',
    value: 9,
  },


]

export interface TX_ML {
  reportDate: string,
  timingLate: string,
  status: string,
  isLate: number
}

export interface PrEP {
  startDate: string | null,
  code: string,
}

export interface PrEPHistoryModel {
  app: App,
  facility: Facility,
  customer: Customer,
  cdO_Employee: Employee,
  prEP_Infomation: PrEP,
  tX_ML: TX_ML[] | null,
}

export interface ARTHistoryModel {
  app: App,
  facility: Facility,
  customer: Customer,
  cdO_Employee: Employee,
  arT_Infomation: PrEP,
  tX_ML: TX_ML[] | null,
}

export interface PrEPHistoryModelEx extends PrEPHistoryModel {
  id: string,
  isDelete: false,
}

export interface ARTHistoryModelEx extends ARTHistoryModel {
  id: string,
  isDelete: false,
}


export const statusTX_MLOpions = [
  {
    key: 0,
    text: 'Bỏ trị',
    value: 'Bỏ trị',
  },
  {
    key: 1,
    text: 'Chuyển đi',
    value: 'Bỏ trị',
  },
  {
    key: 2,
    text: 'Tử vong',
    value: 'Tử vong',
  },
]

export interface ReferModel {
  profileId: string,
  toUnitId: string,
  type: number,
  referDate: string,
  note: string,
  status: number,
}

export interface ReferTicket extends ReferModel {
  employeeId: string,
  receivedDate: string,
  profile: Customer,
  fromUnit: Hospital,
  toUnit: Hospital,
  id: string,
  isDeleted: boolean,
}

export interface ReceivedCustomer extends Customer {
  employeeId?: string;
  idReferTicket: string;
  fromUnitName: string,
  toUnitName: string,
  note: string,
  type: number,
  referDate: string,
  receivedDate: string,
  status: number;
}

export interface LayTestUpdate {
  id: string,
  isDelete?: boolean,
  code?: string,
  takenDate?: number,
  resultTesting?: string
  employeeId: string,
}

export interface PrEPUpdateHistory {
    id: string;
    isDelete?: boolean,
    code?: string,
    startDate?: string;
    employeeId: string,
}


