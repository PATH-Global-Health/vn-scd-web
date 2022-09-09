import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { FaRegBuilding } from 'react-icons/fa';
import { BiBadgeCheck } from 'react-icons/bi';
import { FiCalendar, FiHome, FiTrendingUp, FiUsers } from 'react-icons/fi';

import {
  Dimmer,
  Loader,
  Menu,
  Popup,
  Segment,
  Sidebar,
} from 'semantic-ui-react';

import {
  useAuth,
  useDispatch,
  useRefreshCallback,
  useSelector,
} from '@app/hooks';
import { unwrapResult } from '@reduxjs/toolkit';
import { getCBOs, getInfo, getLastUpdated } from '@smd/redux/cbo';
import { getProjectByToken, getProjects } from '@smd/redux/project';
import { getIndicators } from '@smd/redux/indicator';
import { getSummary } from '@smd/redux/report';

import { ComponentKey, GroupKey } from '@app/utils/component-tree';

import { Filter } from '@smd/components/dashboard/DashboardFilter';
import {
  DashboardFilter,
  DashboardSummary,
  DashboardTitle,
  DashboardChart,
} from '@smd/components/dashboard';
import EfficiencyTable from '@smd/components/efficiency-table';
import { CBO, Project } from '@smd/models';
import { useTranslation } from 'react-i18next';
import { toggleScreenSize } from '@app/slices/global';
import { httpClient } from '@app/utils';

const Wrapper = styled.div`
  padding: 8px;
  background-color: whitesmoke;
`;
const WrapperIcon = styled.span`
  padding-right: 10px;
`;

interface IMenu {
  index: number;
  icon: JSX.Element;
  name: string;
  component: JSX.Element;
}

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isCBO, isProject } = useAuth();

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [cbos, setCbos] = useState<CBO[]>([]);
  const [filter, setFilter] = useState<Filter>();
  const [lastUpdatedDate, setLastUpdatedDate] = useState<Date>();
  const dispatch = useDispatch();

  const menuList: IMenu[] = [
    {
      index: 0,
      icon: <FiHome />,
      name: t('Overview'),
      component: <DashboardSummary />,
    },
    {
      index: 1,
      icon: <FiTrendingUp />,
      name: t('Performance Tracking'),
      component: <EfficiencyTable filter={filter} />,
    },
    {
      index: 2,
      icon: <FiCalendar />,
      name: t('Reporting Period'),
      component: <DashboardChart selected={selected} filter={filter} />,
    },
    {
      index: 3,
      icon: <BiBadgeCheck />,
      name: t('Project/Implementing Partners'),
      component: <DashboardChart selected={selected} filter={filter} />,
    },
    {
      index: 4,
      icon: <FiUsers />,
      name: t('CBO/Social Enterprise'),
      component: <DashboardChart selected={selected} filter={filter} />,
    },
    {
      index: 5,
      icon: <FaRegBuilding />,
      name: t('Province/City'),
      component: <DashboardChart selected={selected} filter={filter} />,
    },
  ];

  const getIndicatorLoading = useSelector(
    (s) => s.smd.indicator.getIndicatorsLoading,
  );

  const getData = useCallback(() => {
    const getSummaryData = async () => {
      const result = await dispatch(getIndicators());
      const indicatorIds = unwrapResult(result).data.map((e) => e.id);
      dispatch(getSummary({ ...filter, indicators: indicatorIds }));
    };
    getSummaryData();
  }, [dispatch, filter]);

  useEffect(getData, [getData]);

  useEffect(() => {
    const getBaseData = async () => {
      const arg = { pageSize: 1000, pageIndex: 0 };
      const p = unwrapResult(await dispatch(getProjects(arg)));
      setProjects(p.data);
      const c = unwrapResult(
        await dispatch(getCBOs({ ...arg, isGetAll: true })),
      );
      const d = unwrapResult(await dispatch(getLastUpdated()));
      setLastUpdatedDate(new Date(d.lastUpdatedDate));
      setCbos(c.data);
    };
    getBaseData();
  }, [dispatch]);

  useEffect(() => {
    if (isProject) {
      dispatch(getProjectByToken());
    }
  }, [dispatch, isProject]);
  useEffect(() => {
    if (isCBO) {
      dispatch(getInfo);
    }
  }, [dispatch, isCBO]);

  useRefreshCallback(
    GroupKey.SMD_DASHBOARD,
    ComponentKey.SMD_DASHBOARD,
    getData,
  );

  // useEffect(() => {
  //   dispatch(toggleScreenSize(true));
  // }, [dispatch]);

  const onExportExcel = async (data: Filter) => {
    httpClient
      .put({
        url: (al) => al.smd.report.exportExcel,
        data: data,
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          vertical
          width="wide"
          icon="labeled"
          visible={visible}
          animation="slide along"
          onHide={() => setVisible(false)}
        >
          {menuList.map((m) => (
            <Menu.Item
              as="a"
              key={m.index}
              active={m.index === selected}
              onClick={() => {
                setVisible(false);
                setSelected(m.index);
              }}
            >
              <WrapperIcon>{m.icon}</WrapperIcon>
              {m.name}
            </Menu.Item>
          ))}
        </Sidebar>

        <Sidebar.Pusher dimmed={visible}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60px', marginTop: '45px' }}>
              <Menu fluid vertical tabular>
                {menuList.map((m) => (
                  <Menu.Item
                    as="a"
                    key={m.index}
                    active={m.index === selected}
                    onClick={() => {
                      setVisible(false);
                      setSelected(m.index);
                    }}
                    style={{ padding: '15px', fontSize: '30px' }}
                  >
                    <Popup
                      trigger={<WrapperIcon>{m.icon}</WrapperIcon>}
                      position="right center"
                      content={m.name}
                    />
                  </Menu.Item>
                ))}
              </Menu>
            </div>
            <div style={{ width: 'calc(100vw - 100px)' }}>
              {/* hide loader on summary sectionn */}
              <Dimmer active={getIndicatorLoading} inverted>
                <Loader />
              </Dimmer>
              <DashboardTitle visible={visible} setVisible={setVisible} />
              <Wrapper>
                <DashboardFilter
                  cbos={cbos}
                  projects={projects}
                  onChange={setFilter}
                  onExportExcel={onExportExcel}
                />
                <div
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    flexDirection: 'row-reverse',
                  }}
                >
                  <i style={{ fontSize: '15px' }}>
                    {t('Latest updated: ')}
                    {`${
                      lastUpdatedDate ? lastUpdatedDate.getMonth() + 1 : 0
                    }/${lastUpdatedDate?.getFullYear()}`}
                  </i>
                </div>

                {menuList.find((m) => m.index === selected)?.component}
              </Wrapper>
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};

export default DashboardPage;
