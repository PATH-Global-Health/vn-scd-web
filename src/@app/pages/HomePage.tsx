import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import styled from 'styled-components';

import { Button, Tab, Container } from 'semantic-ui-react';
import { FiRefreshCw, FiUnlock, FiLock, FiX } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import SignalR from '@app/signalR/SignalR';
import { ExaminationStatus } from '@csyt/examination/examination.model';
import { setStatusMap } from '@csyt/examination/examination.slice';
import { StatusMap } from '@app/components/schedule-calendar';

import { useSelector, useDispatch } from '../hooks';
import {
  closeComponentTab,
  toggleLockComponentTab,
  openComponentTab,
} from '../slices/global';
import { getComponent } from '../utils/component-tree';

// #region styled
const HomePageContainer = styled.div`
  padding: 8px;
  padding-top: 0;
`;
const MenuButtonWrapper = styled.span`
  padding: 4px !important;
`;
const ButtonBase = styled(Button)`
  padding: 4px !important;
  padding-right: 80px !important;
  background: rgba(0, 0, 0, 0) !important;
  font-weight: 400 !important;
`;
const StyledButtonGroup = styled(Button.Group)`
  position: absolute !important;
  right: 4px !important;
`;
const StyledIconButton = styled(Button)`
  border-radius: 50% !important;
  padding: 5px !important;
  height: 22px !important;
  background: rgba(0, 0, 0, 0) !important;
  font-size: 12px !important;
  :hover {
    background: #cacbcd !important;
  }
`;
const ComponentWrapper = styled(Container)`
  display: ${(props): string => (props.hidden ? 'none' : 'block')} !important;
  padding: 8px;
  height: ${({ fullscreen }) => (fullscreen ? '100vh' : 'calc(100vh - 142px)')};
  overflow-y: auto;
  overflow-x: auto;
  background: white;
  border: 1px solid #d4d4d5;
  border-top: none;
`;
const StyledTab = styled(Tab)`
  overflow: auto;
`;
// #endregion

interface Component {
  groupKey: string;
  key: string;
  component: ReactNode;
}

const {
  UNFINISHED,
  FINISHED,
  CANCELED_BY_CUSTOMER,
  NOT_DOING,
  CANCELED,
  RESULTED,
} = ExaminationStatus;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { fullscreen, tabList } = useSelector((state) => state.global);
  // const { language} = useSelector((state) => state.auth);
  // const statusMap = useSelector((s) => s.csyt.examination.statusMap);
  const statusMap = {
    [UNFINISHED]: { color: 'blue', label: t('Not examination') },
    [FINISHED]: { color: 'teal', label: t('Done') },
    [RESULTED]: { color: 'green', label: t('Have result') },
    [CANCELED_BY_CUSTOMER]: { color: 'grey', label: t('Cancel by customer') },
    [NOT_DOING]: { color: 'brown', label: t('No work') },
    [CANCELED]: { color: 'red', label: t('Cancel') },
  } as StatusMap;
  const dispatch = useDispatch();

  // #region tab list
  const panes = useMemo(
    () =>
      tabList.map((tab) => {
        const component = getComponent(tab.groupKey, tab.key);
        return {
          menuItem: (): JSX.Element => (
            <MenuButtonWrapper
              key={`${tab.groupKey}-${tab.key}`}
              className={tab.selected ? 'item active' : 'item'}
            >
              <ButtonBase
                size="mini"
                content={t(component?.locale ?? '').toString()}
                disabled={tabList.some((e) => e.locked)}
                onClick={(): void => {
                  dispatch(
                    openComponentTab({ groupKey: tab.groupKey, key: tab.key }),
                  );
                }}
              />
              <StyledButtonGroup>
                <StyledIconButton
                  circular
                  size="mini"
                  icon={<FiRefreshCw />}
                  onClick={tab.refreshCallback}
                />
                <StyledIconButton
                  circular
                  size="mini"
                  icon={tab.locked ? <FiUnlock /> : <FiLock />}
                  disabled={tabList.some((e) => e.locked) && !tab.locked}
                  onClick={(): void => {
                    dispatch(
                      toggleLockComponentTab({
                        groupKey: tab.groupKey,
                        key: tab.key,
                      }),
                    );
                  }}
                />
                <StyledIconButton
                  circular
                  size="mini"
                  icon={<FiX />}
                  disabled={tab.locked}
                  onClick={(): void => {
                    dispatch(
                      closeComponentTab({
                        groupKey: tab.groupKey,
                        key: tab.key,
                      }),
                    );
                  }}
                />
              </StyledButtonGroup>
            </MenuButtonWrapper>
          ),
        };
      }),
    [t, dispatch, tabList],
  );

  const hasSelected = tabList.some((c) => c.selected);
  const tabListNode = useMemo(
    () =>
      hasSelected ? <StyledTab panes={panes} renderActiveOnly={false} /> : null,
    [hasSelected, panes],
  );
  // #endregion

  // #region content list
  const [contentList, setContentList] = useState<Component[]>([]);
  useEffect(() => {
    // new component
    const newComp = tabList.find((tab) =>
      contentList.every(
        (c) => !(c.groupKey === tab.groupKey && c.key === tab.key),
      ),
    );
    const comp = getComponent(newComp?.groupKey ?? '', newComp?.key ?? '');
    if (newComp && comp) {
      setContentList((cl) => [
        ...cl,
        {
          groupKey: newComp.groupKey,
          key: comp.key,
          component: comp.component,
        },
      ]);
    }

    // close component
    const closedComponent = contentList.find((e) =>
      tabList.every(
        (tab) => !(tab.groupKey === e.groupKey && tab.key === e.key),
      ),
    );
    if (closedComponent) {
      setContentList((cl) =>
        cl.filter(
          (e) =>
            !(
              e.groupKey === closedComponent.groupKey &&
              e.key === closedComponent.key
            ),
        ),
      );
    }
  }, [tabList, contentList]);

  useEffect(() => {
    dispatch(setStatusMap(statusMap));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, t]);

  const selectedTab = tabList.find((e) => e.selected) ?? {
    groupKey: '',
    key: '',
  };
  const { groupKey: selectedGroupKey, key: selectedKey } = selectedTab;
  const contentListNode = useMemo(
    () => (
      <div>
        {contentList.map((c) => (
          <ComponentWrapper
            fluid
            fullscreen={fullscreen ? 1 : 0}
            key={`${c.groupKey}-${c.key}`}
            hidden={!(c.groupKey === selectedGroupKey && c.key === selectedKey)}
          >
            {c.component}
          </ComponentWrapper>
        ))}
      </div>
    ),
    [contentList, selectedGroupKey, selectedKey, fullscreen],
  );
  // #endregion

  return (
    <HomePageContainer>
      <SignalR />
      {!fullscreen && tabListNode}
      {contentListNode}
    </HomePageContainer>
  );
};

export default HomePage;
