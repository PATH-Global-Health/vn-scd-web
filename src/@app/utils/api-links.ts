// const baseUrl = 'https://smapi.vkhealth.vn';
const apigw = 'https://apigw.vkhealth.vn';
const csytUrl = 'https://api.vkhealth.vn';
// const userGateway = 'https://user.bakco.vn/api';
const isProduction = true;

const userManagementUrl = 'https://auth.quanlyhiv.vn';
const csytGateway = 'https://scd-demo-api.quanlyhiv.vn/api';
const examinationUrl = 'https://booking-management.bakco.vn';

const telehealthBookingUrl = 'http://202.78.227.99:32068';

const smdUrl = isProduction
  ? 'https://scd-api.quanlyhiv.vn/api'
  : 'https://scd-api.bakco.vn/api';

const apiLinks = {
  test: {
    getPosts: 'https://jsonplaceholder.typicode.com/posts',
    modifyPost: 'https://jsonplaceholder.typicode.com/posts/',
  },
  auth: {
    token: `${userManagementUrl}/api/Users/Login`,
    userInfo: `${csytGateway}/Hospitals/infomation`,
    updateInfo: `${csytGateway}/Hospitals/infomation`,
    updateLogo: `${csytGateway}/Hospitals/Logo`,
    getLogo: `${csytGateway}/Hospitals/Logo`,
    getPermissionUI: `${userManagementUrl}/api/Users/Permissions/Ui`,
    forgotPassword: `${userManagementUrl}/api/Users/ForgotPassword`,
    setNewToken: `${userManagementUrl}/api/Users/SetNewPassword`,
  },
  manageAccount: {
    unitTypes: `${
      process.env.NODE_ENV !== 'development' ? csytGateway : smdUrl
    }/UnitTypes`,
    hospitals: `${csytGateway}/Hospitals/`,
    referHospitals: `${csytGateway}/Hospitals/FilterByFunctionFacility`,
  },
  admin: {
    userManagement: {
      user: {
        get: `${userManagementUrl}/api/Users`,
        create: `${userManagementUrl}/api/Users`,
        resetPassword: `${userManagementUrl}/api/Users/ChangePassword`,
        resetPasswordOTP: `${userManagementUrl}/api/Users/ResetPassword`,
        generateOTP: `${userManagementUrl}/api/Users/ResetPassword/GenerateOTP`,
        confirmOTP: `${userManagementUrl}/api/Users/ResetPassword/ConfirmOTP`,
        getGroups: `${userManagementUrl}/api/Users/Groups`,
        getRoles: `${userManagementUrl}/api/Users/Roles`,
        getPermissionsUI: `${userManagementUrl}/api/Users/Permissions/Ui`,
        getPermissionsResource: `${userManagementUrl}/api/Users/Permissions/Resource`,
        resetDefaultPassword: `${userManagementUrl}/api/Users/Tools/ResetDefaultPassword`,
      },
      group: {
        get: `${userManagementUrl}/api/Groups`,
        create: `${userManagementUrl}/api/Groups`,
        update: `${userManagementUrl}/api/Groups`,
        delete: `${userManagementUrl}/api/Groups`,
        getUsers: `${userManagementUrl}/api/Groups`,
        getRoles: `${userManagementUrl}/api/Groups`,
        getPermissionsUI: `${userManagementUrl}/api/Groups`,
        getPermissionsResource: `${userManagementUrl}/api/Groups`,
        addUser: `${userManagementUrl}/api/Groups`,
        removeUser: `${userManagementUrl}/api/Groups`,
        addRoles: `${userManagementUrl}/api/Groups`,
        removeRole: `${userManagementUrl}/api/Groups`,
        addPermissionsUI: `${userManagementUrl}/api/Groups`,
        addPermissionsResource: `${userManagementUrl}/api/Groups`,
      },
      role: {
        get: `${userManagementUrl}/api/Roles`,
        create: `${userManagementUrl}/api/Roles`,
        update: `${userManagementUrl}/api/Roles`,
        delete: `${userManagementUrl}/api/Roles`,
        addUser: `${userManagementUrl}/api/Roles`,
        removeUser: `${userManagementUrl}/api/Roles`,
        addPermissionsUI: `${userManagementUrl}/api/Roles`,
        addPermissionsResource: `${userManagementUrl}/api/Roles`,
        getUsers: `${userManagementUrl}/api/Roles`,
        getPermissionsUI: `${userManagementUrl}/api/Roles`,
        getPermissionsResource: `${userManagementUrl}/api/Roles`,
      },
      permission: {
        get: `${userManagementUrl}/api/Permissions`,
        create: `${userManagementUrl}/api/Permissions`,
        update: `${userManagementUrl}/api/Permissions`,
        delete: `${userManagementUrl}/api/Permissions`,
        addUser: `${userManagementUrl}/api/Permissions`,
      },
    },
  },
  csyt: {
    doctor: {
      get: `${csytGateway}/Doctors`,
      getAll: `${csytGateway}/Doctors/GetAllDoctor`,
      create: `${csytGateway}/Doctors`,
      update: `${csytGateway}/Doctors`,
      delete: `${csytGateway}/Doctors/`,
      registerDoctor: `${csytGateway}/Doctors/RegisterDoctor`,
      resetDefaultPassword: `${userManagementUrl}/api/Users/Tools/ResetDefaultPassword`,
    },
    room: {
      get: `${csytGateway}/Rooms`,
      create: `${csytGateway}/Rooms`,
      update: `${csytGateway}/Rooms`,
      delete: `${csytGateway}/Rooms/`,
    },
    service: {
      get: `${csytGateway}/Services`,
      create: `${csytGateway}/Services`,
      update: `${csytGateway}/Services`,
      delete: `${csytGateway}/Services`,
      getServicesByServiceFormAndServiceType: `${csytGateway}/Services/ServiceFormAndServiceType`,
    },
    serviceForm: {
      get: `${csytGateway}/ServiceForms`,
      create: `${csytGateway}/ServiceForms`,
      update: `${csytGateway}/ServiceForms`,
      delete: `${csytGateway}/ServiceForms`,
    },
    serviceUnit: {
      get: `${csytGateway}/ServiceUnits`,
      create: `${csytGateway}/ServiceUnits`,
      update: `${csytGateway}/ServiceUnits`,
      delete: `${csytGateway}/ServiceUnits/`,
    },
    unitDoctor: {
      get: `${csytGateway}/UnitDoctors`,
      create: `${csytGateway}/UnitDoctors`,
      update: `${csytGateway}/UnitDoctors`,
      delete: `${csytGateway}/UnitDoctors/`,
    },
    injectionObject: {
      get: `${csytGateway}/InjectionObjects`,
      create: `${csytGateway}/InjectionObjects`,
      update: `${csytGateway}/InjectionObjects`,
      delete: `${csytGateway}/InjectionObjects/`,
    },
    unitType: {
      get: `${csytGateway}/UnitTypes`,
      create: `${csytGateway}/UnitTypes`,
      update: `${csytGateway}/UnitTypes`,
      delete: `${csytGateway}/UnitTypes/`,
    },
    hospital: {
      get: `${csytGateway}/Hospitals`,
      getLogo: `${csytGateway}/Hospitals/Logo`,
      create: `${csytGateway}/Hospitals`,
      update: `${csytGateway}/Hospitals`,
      delete: `${csytGateway}/Hospitals/`,
      setTesting: `${csytGateway}/Hospitals/SetTestingFacility`,
      setPrEP: `${csytGateway}/Hospitals/SetPrEPFacility`,
      setARV: `${csytGateway}/Hospitals/SetARTFacility`,
    },
    catalog: {
      customer: {
        get: `${csytUrl}/api/BkCustomer/Get/`,
        getDetails: `${csytUrl}/api/BkCustomer/GetById/`,
        create: `${csytUrl}/api/BkCustomer/Create`,
      },
      profile: {
        get: `${csytGateway}/Profiles/Filter`,
        getDetails: `${csytGateway}/Profiles/`,
        create: `${csytGateway}/Profiles/`,
      },
    },
    serviceType: {
      get: `${csytGateway}/ServiceTypes/`,
      create: `${csytGateway}/ServiceTypes/`,
      update: `${csytGateway}/ServiceTypes/`,
      delete: `${csytGateway}/ServiceTypes/`,
    },
    workingSchedule: {
      getGroupNameList: `${csytUrl}/api/ScheduleGroup/GetGroups/`,
      getScheduleGroupList: `${csytUrl}/api/ScheduleGroup/Get/`,
      getScheduleDayList: `${csytUrl}/api/Schedule/Get`,
      getScheduleInstanceList: `${csytUrl}/api/ScheduleInstance/Get`,
      createScheduleGroup: `${csytUrl}/api/ScheduleGroup/Create`,
      publishScheduleGroup: `${csytUrl}/api/ScheduleGroup/Publish/`,
      unPublishScheduleGroup: `${csytUrl}/api/ScheduleGroup/UnPublish/`,
      publishScheduleDay: `${csytUrl}/api/Schedule/Publish/`,
      unPublishScheduleDay: `${csytUrl}/api/Schedule/UnPublish/`,
      openScheduleInstances: `${csytUrl}/api/ScheduleInstance/Open/`,
      closeScheduleInstances: `${csytUrl}/api/ScheduleInstance/Close/`,
    },
    workingCalendar: {
      get: `${csytGateway}/WorkingCalendars/GetByUnit`,
      create: `${csytGateway}/WorkingCalendars`,
      delete: `${csytGateway}/WorkingCalendars/`,
      publish: `${csytGateway}/WorkingCalendars/Publish`,
      cancel: `${csytGateway}/WorkingCalendars/Cancel`,
      getDays: `${csytGateway}/WorkingCalendars/GetDays`,
      publishDays: `${csytGateway}/WorkingCalendars/Publish/Day`,
      cancelDays: `${csytGateway}/WorkingCalendars/Cancel/Day`,
      getIntervals: `${csytGateway}/WorkingCalendars/GetIntervals`,
      publishIntervals: `${csytGateway}/WorkingCalendars/Publish/Interval`,
      cancelIntervals: `${csytGateway}/WorkingCalendars/Cancel/Interval`,
      getAvailableWorkingCalendar: `${csytGateway}/WorkingCalendars/GetFullDaysByUnitAndService`,
      getDaysByUnitAndService: `${csytGateway}/WorkingCalendars/GetDaysByUnitAndService`,
      checkSchedule: `${csytGateway}/WorkingCalendars/CheckScheduledDoctor`,
    },
    referTicket: {
      create: `${csytGateway}/ReferTicket`,
      get: `${csytGateway}/ReferTicket/ReceivedTicket`,
      update: `${csytGateway}/ReferTicket/RecviveTicket`,
    },
    vaccination: {
      getSchedules: `${examinationUrl}/api/Vaccinations`,
      getStatistic: `${examinationUrl}/api/Vaccinations/Statistic`,
      getInjectionObjects: `${csytGateway}/InjectionObjects`,
      getAvailableDays: (hospitalId: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Days?form=5`,
      getAvailableServices: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Services?form=5&date=${date}`,
      getAvailableDoctors: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Doctors?form=5&date=${date}`,
      getTicket: `${apigw}/api/Tickets`,
      register: `${examinationUrl}/api/Vaccinations`,
      update: `${examinationUrl}/api/Vaccinations`,
      getTransferHospitals: `${csytUrl}/api/BkHospital/GetByHealthCareId`,
      getAvailableDateForExport: `${examinationUrl}/api/Excels/AvailableDatesForVaccReport`,
      exportVaccReport: `${examinationUrl}/api/Excels/VaccReport`,
    },
    examination: {
      register: `${examinationUrl}/api/Examinations`,
      getSchedules: `${examinationUrl}/api/Examinations`,
      getStatistic: `${examinationUrl}/api/Examinations/Statistic`,
      getInjectionObjects: `${csytGateway}/InjectionObjects`,
      updateSchedule: `${examinationUrl}/api/Examinations`,
      getAvailableDateForExport: `${examinationUrl}/api/Excels/AvailableDatesForExamReport`,
      exportExamReport: `${examinationUrl}/api/Excels/ExamReport`,
      getAvailableDays: (hospitalId: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Days?form=5`,
      getAvailableDoctors: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Doctors?form=5&date=${date}`,
      createResultForm: `${examinationUrl}/api/Examinations/CreateResultForm`,
      updateResultForm: `${examinationUrl}/api/Examinations/UpdateResultForm`,
      createTestingHistory: `${examinationUrl}/api/TestingHistory`,
      getTestingHistory: `${examinationUrl}/api/TestingHistory/LayTest`,
      getPrEPHistory: `${examinationUrl}/api/PrEP/GetByCustomerId`,
      createPrEPHistory: `${examinationUrl}/api/PrEP`,
      getARTHistory: `${examinationUrl}/api/ART/GetByCustomerId`,
      createARTHistory: `${examinationUrl}/api/ART`,
      updateLayTest: `${examinationUrl}/api/TestingHistory/LayTest`,

      updatePrEPHistory: `${examinationUrl}/api/PrEP`,
      updateARTHistory: `${examinationUrl}/api/ART`,
    },
    telehealth: {
      register: `${telehealthBookingUrl}/api/Telehealths`,
      getSchedules: `${telehealthBookingUrl}/api/Telehealths`,
      updateSchedule: `${telehealthBookingUrl}/api/Telehealths`,
    },
    telemedicine: {
      getHospitals: `${csytUrl}/api/BkHospital/GetByForm?Form=3`,
      getDoctors: `${csytUrl}/api/BkHospital/GetDoctorByForm?Form=3&Id=`,
      getServices: `${csytUrl}/api/BkDoctor/GetServicesByDoctor?Form=3&DoctorId=`,
      getWorkingDays: `${csytUrl}/api/Telemedicine/GetWorkingDays`,
      getSlots: `${csytUrl}/api/BkHealthCareScheduler/GetByDoctor`,
      register: `${csytUrl}/api/Telemedicine/Register`,
      payment: `${csytUrl}/api/Telemedicine/Payment`,
      postFiles: `${csytUrl}/api/Telemedicine/PostFile/`,
      getTickets: `${csytUrl}/api/Telemedicine/GetTickets`,
      getSchedule: `${csytUrl}/api/Telemedicine/GetSchedules`,
      getFileList: `${csytUrl}/api/Telemedicine/GetFiles/`,
      update: `${csytUrl}/api/Telemedicine/Update/`,
      downloadFile: `${csytUrl}/api/Telemedicine/GetFile/`,
    },
    userProfile: {
      getAll: `${csytGateway}/Profiles/ProfileFromDhealth`,
      getFilter: `${csytGateway}/Profiles/Filter`,
      getByStatus: `${csytGateway}/Profiles/ProfileByStatus`,
      create: `${csytGateway}/Profiles`,
      getById: `${csytGateway}/Profiles`,
      createByFacility: `${csytGateway}/Profiles/ProfileByFacility`,
      update: `${csytGateway}/Profiles`,
      delete: `${csytGateway}/Profiles`,
      getByUnitId: `${csytGateway}/Profiles/ProfileByUnitId`,
    },
  },
  smd: {
    cbo: {
      getAll: `${smdUrl}/Projects/Units`,
      get: `${smdUrl}/Projects/UnitsInProject`,
      getByToken: `${smdUrl}/Projects/UnitsInProjectByProjectUsername`,
      getInfo: `${smdUrl}/Projects/UnitByUsername`,
      create: `${smdUrl}/Projects/UnitsInProject`,
      update: `${smdUrl}/Projects/UnitsInProject`,
      delete: `${smdUrl}/Projects/UnitsInProject/`,
    },
    report: {
      get: `${smdUrl}/Reports/Get`,
      exportExcel: `${smdUrl}/Reports/GetExcel`,
      getByAdmin: `${smdUrl}/Reports`,
      getByCBO: `${smdUrl}/Reports/ByCBO`,
      getByProject: `${smdUrl}/Reports/ByProject`,
      create: `${smdUrl}/Reports`,
      update: `${smdUrl}/Reports`,
      delete: `${smdUrl}/Reports/`,
      summary: `${smdUrl}/Reports/Summary`,
      barChart: `${smdUrl}/Reports/BarChart`,
      importByCBO: `${smdUrl}/Reports/ImportByCBO`,
      importByProject: `${smdUrl}/Reports/ImportByProject`,
      importRawByCBO: `${smdUrl}/Reports/ImportRawByCBO`,
      importRawByProject: `${smdUrl}/Reports/ImportRawByProject`,
      efficiency: `${smdUrl}/Reports/Efficiency`,
      getHistories: `${smdUrl}/Reports/Histories`,
      getLastUpdated: `${smdUrl}/Reports/GetLastUpdatedDate`,
      getListProvincesWithData: `${smdUrl}/Reports/ListProvincesWithData`,
      getListCBOsWithData: `${smdUrl}/Reports/ListCBOsWithData`,
    },
    kpi: {
      get: `${smdUrl}/Indicators/KPIs`,
      create: `${smdUrl}/Indicators/KPIs`,
      update: `${smdUrl}/Indicators/KPIs`,
      delete: `${smdUrl}/Indicators/KPIs/`,
    },
    indicator: {
      get: `${smdUrl}/Indicators?pageSize=10000&pageIndex=0`,
      create: `${smdUrl}/Indicators`,
      update: `${smdUrl}/Indicators`,
      delete: `${smdUrl}/Indicators/`,
    },
    project: {
      get: `${smdUrl}/Projects`,
      getByToken: `${smdUrl}/Projects/ByUsername`,
      create: `${smdUrl}/Projects`,
      update: `${smdUrl}/Projects`,
      delete: `${smdUrl}/Projects/`,
    },
    package: {
      get: `${smdUrl}/Packages`,
      create: `${smdUrl}/Packages`,
      update: `${smdUrl}/Packages`,
      delete: `${smdUrl}/Packages/`,
    },
    implementPackage: {
      get: `${smdUrl}/Packages/ImplementPackages`,
      create: `${smdUrl}/Packages/ImplementPackages`,
      update: `${smdUrl}/Packages/ImplementPackages`,
    },
    contract: {
      get: `${smdUrl}/Packages/Contracts`,
      create: `${smdUrl}/Packages/Contracts`,
      active: `${smdUrl}/Packages/ActiveContract`,
    },
    target: {
      get: `${smdUrl}/Packages/Targets`,
      create: `${smdUrl}/Packages/Targets`,
      update: `${smdUrl}/Packages/Targets`,
    },
    unitType: {
      get: `${smdUrl}/UnitTypes`,
    },
    patientInfo: {
      get: `${smdUrl}/PatientInfos/Get`,
      create: `${smdUrl}/PatientInfos`,
      update: `${smdUrl}/PatientInfos`,
      delete: `${smdUrl}/PatientInfos`,
      getHistory: `${smdUrl}/PatientInfos/Histories`,
    },
  },
};

export default apiLinks;
