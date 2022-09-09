import React, { ReactNode } from 'react';

import HospitalsPage from '@admin/manage-account/pages/HospitalsPage';

import DoctorsPage from '@csyt/catalog/doctor';
import RoomsPage from '@csyt/catalog/room';
import WorkingSchedulePage from '@csyt/working-schedule';
import ExaminationPage from '@csyt/examination';
import ProfilePage from '@app/pages/ProfilePage';
import ExaminationStatisticPage from '@csyt/examination/components/statistic';
import CustomersPage from '@admin/manage-customer/pages/CustomersPage';
import ServicesPage from '@csyt/catalog/service';

import ProjectPage from '@smd/pages/project';
import KPIPage from '@smd/pages/kpi';
import CBOPage from '@smd/pages/cbo';
import PackagePage from '@smd/pages/smd-package';
import ReportPage from '@smd/pages/report';
import IndicatorPage from '@smd/pages/indicator';
import DashboardPage from '@smd/pages/dashboard';
import PersonalDataPage from '@smd/pages/personal-data';
import ImplementPackagePage from '@smd/pages/implement-package';

export enum GroupKey {
  // #region admin
  ADMIN_ACCOUNT = 'ADMIN_ACCOUNT',
  ADMIN_USER_MANAGEMENT = 'ADMIN_USER_MANAGEMENT',
  // #endregion

  // #region csyt
  CSYT_CATALOG = 'CSYT_CATALOG',
  CSYT_WORKING_SCHEDULE = 'CSYT_WORKING_SCHEDULE',
  CSYT_VACCINATION = 'CSYT_VACCINATION',
  CSYT_EXAMINATION = 'CSYT_EXAMINATION',
  CSYT_TELEHEALTH = 'CSYT_TELEHEALTH',
  CSYT_TELEMEDICINE = 'CSYT_TELEMEDICINE',
  CSYT_VACCINATION_STATISTIC = 'CSYT_VACCINATION_STATISTIC',
  CSYT_EXAMINATION_STATISTIC = 'CSYT_EXAMINATION_STATISTIC',
  // #endregion

  // #region smd
  SMD_MANAGEMENT = 'SMD_MANAGEMENT',
  SMD_DASHBOARD = 'SMD_DASHBOARD',
  SMD_INPUT = 'SMD_INPUT',
  // #endregion
}

export enum ComponentKey {
  // #region admin
  ADMIN_UNIT_TYPES = 'ADMIN_UNIT_TYPES',
  ADMIN_HOSPITALS = 'ADMIN_HOSPITALS',

  ADMIN_USER = 'ADMIN_USER',
  ADMIN_GROUP = 'ADMIN_GROUP',
  ADMIN_ROLE = 'ADMIN_ROLE',
  // ADMIN_PERMISSION = 'ADMIN_PERMISSION',
  // #endregion

  // #region csyt
  CSYT_DOCTOR = 'CSYT_DOCTOR',
  CSYT_ROOM = 'CSYT_ROOM',
  CSYT_SERVICE = 'CSYT_SERVICE',
  CSYT_SERVICE_TYPE = 'CSYT_SERVICE_TYPE',
  CSYT_SERVICE_FORM = 'CSYT_SERVICE_FORM',
  CSYT_SERVICE_UNIT = 'CSYT_SERVICE_UNIT',
  CSYT_UNIT_DOCTOR = 'CSYT_UNIT_DOCTOR',
  CSYT_INJECTION_OBJECT = 'CSYT_INJECTION_OBJECT',
  CSYT_UNIT_TYPE = 'CSYT_UNIT_TYPE',

  CSYT_TELEMEDICINE_BOOKING = 'CSYT_TELEMEDICINE_BOOKING',
  CSYT_TELEMEDICINE_TICKET = 'CSYT_TELEMEDICINE_TICKET',
  CSYT_TELEMEDICINE_SCHEDULE = 'CSYT_TELEMEDICINE_SCHEDULE',

  CSYT_CUSTOMER = 'CSYT_CUSTOMER',
  // CSYT_CATALOG = 'CSYT_CATALOG',
  // #endregion

  // #region smd
  SMD_PERSONAL_DATA = 'SMD_PERSONAL_DATA',
  SMD_DASHBOARD = 'SMD_DASHBOARD',
  SMD_PROJECT = 'SMD_PROJECT',
  SMD_KPI = 'SMD_KPI',
  SMD_CBO = 'SMD_CBO',
  SMD_PACKAGE = 'SMD_PACKAGE',
  SMD_IMPLEMENT_PACKAGE = 'SMD_IMPLEMENT_PACKAGE',
  SMD_REPORT = 'SMD_REPORT',
  SMD_INDICATOR = 'SMD_INDICATOR',
  TEST1 = 'TEST1',
  TEST2 = 'TEST2',
  // #endregion
}

interface Component {
  key: GroupKey | ComponentKey;
  title: string;
  locale: string;
  component?: ReactNode;
  childrenList?: Component[];
  permissionCode?: string;
}

const componentTree: Component[] = [
  {
    key: GroupKey.ADMIN_ACCOUNT,
    title: 'Tài khoản',
    locale: 'Account',
    permissionCode: GroupKey.ADMIN_ACCOUNT,
    component: <ProfilePage />,
  },
  {
    key: GroupKey.ADMIN_USER_MANAGEMENT,
    title: 'Khách hàng',
    locale: 'Customer',
    permissionCode: ComponentKey.CSYT_CUSTOMER,
    component: <CustomersPage />,
  },
  {
    key: GroupKey.CSYT_CATALOG,
    title: 'Danh mục',
    locale: 'Catalog',
    permissionCode: GroupKey.CSYT_CATALOG,
    childrenList: [
      {
        key: ComponentKey.CSYT_DOCTOR,
        title: 'Cán bộ',
        locale: 'Staff',
        component: <DoctorsPage />,
      },
      {
        key: ComponentKey.ADMIN_HOSPITALS,
        title: 'Đơn vị',
        locale: 'Unit',
        component: <HospitalsPage />,
      },
      {
        key: ComponentKey.CSYT_SERVICE,
        title: 'Dịch vụ',
        locale: 'Service',
        permissionCode: '',
        component: <ServicesPage />,
      },
      {
        key: ComponentKey.CSYT_ROOM,
        title: 'Phòng/Buồng',
        locale: 'Room',
        component: <RoomsPage />,
      },
    ],
  },
  {
    key: GroupKey.SMD_DASHBOARD,
    title: 'Dashboard',
    locale: 'Dashboard',
    permissionCode: ComponentKey.SMD_DASHBOARD,
    component: <DashboardPage />,
  },
  {
    key: GroupKey.SMD_MANAGEMENT,
    title: 'Danh mục',
    locale: 'SCD_Category',
    permissionCode: GroupKey.SMD_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.SMD_PACKAGE,
        title: 'Quản lý gói',
        locale: 'Package Management',
        permissionCode: ComponentKey.SMD_PACKAGE,
        component: <PackagePage />,
      },
      {
        key: ComponentKey.SMD_IMPLEMENT_PACKAGE,
        title: 'Quản lý gói theo tỉnh/thành',
        locale: 'Implement Package Management',
        component: <ImplementPackagePage />,
      },
      {
        key: ComponentKey.SMD_INDICATOR,
        title: 'Quản lý chỉ số',
        locale: 'Indicator Management',
        permissionCode: ComponentKey.SMD_INDICATOR,
        component: <IndicatorPage />,
      },
      {
        key: ComponentKey.SMD_KPI,
        title: 'Quản lý KPI',
        locale: 'KPI Management',
        permissionCode: ComponentKey.SMD_KPI,
        component: <KPIPage />,
      },
      {
        key: ComponentKey.SMD_PROJECT,
        title: 'Quản lý dự án',
        locale: 'Project Management',
        permissionCode: ComponentKey.SMD_PROJECT,
        component: <ProjectPage />,
      },
    ],
  },
  {
    key: GroupKey.SMD_INPUT,
    title: 'Nhập liệu',
    locale: 'SCD_Input',
    permissionCode: GroupKey.SMD_INPUT,
    childrenList: [
      {
        key: ComponentKey.SMD_CBO,
        title: 'Quản lý CBO',
        locale: 'CBOs Management',
        permissionCode: ComponentKey.SMD_CBO,
        component: <CBOPage />,
      },
      {
        key: ComponentKey.SMD_REPORT,
        title: 'Quản lý báo cáo',
        locale: 'Report Management',
        permissionCode: ComponentKey.SMD_REPORT,
        component: <ReportPage />,
      },
      {
        key: ComponentKey.SMD_PERSONAL_DATA,
        title: 'Quản lý dữ liệu cá thể',
        locale: 'Individual data management',
        // permissionCode: ComponentKey.SMD_PERSONAL_DATA,
        component: <PersonalDataPage />,
      },
    ],
  },
  {
    key: GroupKey.CSYT_WORKING_SCHEDULE,
    title: 'Lịch làm việc',
    locale: 'Working Schedule',
    permissionCode: GroupKey.CSYT_WORKING_SCHEDULE,
    component: <WorkingSchedulePage />,
  },
  {
    key: GroupKey.CSYT_EXAMINATION,
    title: 'Lịch hẹn',
    locale: 'Appointment Schedule',
    permissionCode: GroupKey.CSYT_EXAMINATION,
    component: <ExaminationPage />,
  },
  {
    key: GroupKey.CSYT_EXAMINATION_STATISTIC,
    title: 'Thống kê',
    locale: 'Statistic',
    permissionCode: GroupKey.CSYT_EXAMINATION_STATISTIC,
    component: <ExaminationStatisticPage />,
  },
];

const getGroup = (groupKey: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  return group ?? null;
};

const getComponent = (groupKey: string, key: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  if (group) {
    if (!group.childrenList) {
      return group;
    }
    const childComponent = group.childrenList.find((c) => c.key === key);
    return childComponent ?? null;
  }
  return null;
};
export default componentTree;
export { getGroup, getComponent };
