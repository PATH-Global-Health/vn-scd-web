import React, { useEffect, useState } from 'react';
import {
  Menu,
  Loader,
  Dimmer,
  Button,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import componentTree, {
  ComponentKey,
  getGroup,
  GroupKey,
} from '@app/utils/component-tree';

import { useSelector, useDispatch, useAuth } from '@app/hooks';
import { openComponentTab } from '@app/slices/global';

import MenuButton from './MenuButton';
import UserProfileButton from './UserProfileButton';

import packageJson from '../../../../package.json';
import { setLanguageGlobal } from '@app/slices/auth';
// import logo from '../../assets/img/logo.png';

const Wrapper = styled.div`
  padding: 8px;
`;
const StyledItem = styled(Menu.Item)`
  border-top: none;
  font-weight: 300;
  ${(props: { selected?: boolean }) =>
    props.selected &&
    css`
      border-top: 2px solid !important;
      font-weight: 600 !important;
    `}
`;

const AppBar: React.FC = () => {
  const vietnamFlag =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAgVBMVEXaJR3//wDZEx7qlhTXAB7ZHR3ZGx3zxg7YCx7rmxT++wHqmBT99gT88Ab43Qr32Av21Az0yw3ywQ/iZRnwuBDurhLtqBLjcBjfUxr65wj76wfsoxPcPBzbLRz54QnpkBXnhRbmfxfleRfjbBjhXRreTRvzxA/wthHdRBvgWRrniRZlYMFKAAAEEElEQVR4nO3d63aiMBQFYBNPEG/Veqla71Zbp+//gIMiSCAIKF3Kyf7+dmYWnMmOMZyUWg0AAAAAAAAAAAAAAAAAAAAAAAAArpbPvoDXQw169iW8GrUQC/Xsi3gxsima8tkX8WJoJVYIj0YthRBLhCdK1r2a1BGeKHrzavKG8GjEybMv4qXI9bkma4TninrnmvQQnislfPjgCcnfS01+EZ4A9S816SM8ASkCGCcXchPWZIOi+Og9rMk7wuNzxZX77It5DXIbqckW4TmJRAfhuSARhZp4nJ1Wk53z7At6AdTQaoKt6lo8OgiPx5nEajJBeGgQq8kAAyUeHYSn5nwlavJle3jceHS88Ni+vqdWoiYty8PjDBMlEWJod3jckaEmI7vDQx1DTTpWh0ftDSURYm/z/r37Y6zJj83hMUbH7vCoqbEkQkwZhkfJXGicUpMx5fsHKlQ6NZnX81h3U2rSXef6+/NJhYoiTcuO8o0qtbijYXLNXrqvik3FUvX+uCI9Vb3HHlT/05K0KzZIfHRIm0If1zlUsiTel97EvmJZBlSp2VVDu+z7u8O2ooPEJ5er0isyW1ZvctUo+ii5JB9UoYVaCtqXuVRp7Sudm4Aj+9n3mlNfVndy1dG6pJKsWQwSn3v8LKEi3SOrvSZFj38rHDGYXHUUf1Ze1IRRbgKy9vZARd5qFV+UmClq3l2SObvcBGhq3pPO0pkyzE3AcRvZFUhouFwWJWa0ya5BzIbxIPHJxaxQRWYLlpOrTqU+wTAZs51cdTTMO9V2huxzE6C8M61FzbJudjUuWH3BucXZ5q7Jlven8JV2EOM2a45pJFti01lSE6fIZr4lxzTou0BNvu0YKEWiY0l4EgcxbrPimEbBB6ZWHNMwdJPfYkOnueEgxm0WHNMwdpPfYkGnecHo2BAe40EMfzyk/YD9MY2UbvLTNnTaBjb7TvOUbvIGOTUnZVuFe6d5ykGMS+MRbY0/ZX5Mwxida+ORXJo2sJmHxxSd6Da0cQO7yzo8hoMYrdg2tKkDm+MxjZCbGAV9J/74RjqJtqYx5/BQvIu4bopFoq2Jc3jUIXavKY1H7jFWuwPf8Ei9L3SQ+owv3tb0wff5KGldbbtbidA7sD/ZhkcdI7e5yuiG1juwj1zDI+fXm8xuPFIU/eNcw0PhIrXzL08Y6F+4wpsxDY9aBHf4nrPxyHHDJ4ZMXwgggxa/3/z/6WFbE9MXApA/aX4uiqxK3YX/WcXzhQDnX+vvfckt2HikyP8qzfKFALJ9urU7zr/Seae/zTE8p1/rf9/51/O5XJYvBPCi07y3YY+8McbwnUWy2Xrg/CsdWgw/eWT7oSNajuQ4oTx6SwxLAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMx/np0p7vEdSWwAAAAASUVORK5CYII=';
  const americanFlag =
    'data:image/png;base64,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';
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { hasPermission } = useAuth();

  const { tabList, fullscreen } = useSelector((state) => state.global);
  const { getUserInfoLoading, token } = useSelector((state) => state.auth);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (hasPermission(ComponentKey.SMD_DASHBOARD)) {
      dispatch(
        openComponentTab({
          groupKey: GroupKey.SMD_DASHBOARD,
          key: ComponentKey.SMD_DASHBOARD,
        }),
      );
    }
  }, [dispatch, hasPermission]);

  return token ? (
    <Wrapper>
      {!fullscreen ? (
        <Menu>
          <Menu.Item>
            SCD
            <Dimmer active={getUserInfoLoading} inverted>
              <Loader />
            </Dimmer>
          </Menu.Item>
          {componentTree.map((item) => {
            if (item.permissionCode && !hasPermission(item.permissionCode))
              return null;
            const tmp = getGroup(item.key);
            if (!tmp) return null;
            if (item.childrenList) {
              return (
                <MenuButton
                  key={item.key}
                  groupKey={tmp.key ?? ''}
                  childrenList={item.childrenList.map((c) => ({
                    key: c.key,
                    permissionCode: c.permissionCode,
                  }))}
                />
              );
            }
            return (
              <StyledItem
                selected={tabList.some(
                  (e) => e.selected && e.groupKey === tmp?.key,
                )}
                key={tmp?.key}
                content={t(tmp.locale).toString()}
                onClick={(): void => {
                  dispatch(
                    openComponentTab({
                      groupKey: item.key,
                      key: item.key,
                    }),
                  );
                }}
              />
            );
          })}

          <Menu.Menu position="right">
            <UserProfileButton />
          </Menu.Menu>
          <Menu.Item
            onClick={() => {
              if (language === 'en') {
                setLanguage('vn');
                i18n.changeLanguage(language);
              } else {
                setLanguage('en');
                i18n.changeLanguage(language);
              }

              dispatch(setLanguageGlobal(language));
            }}
          ></Menu.Item>
          <Dropdown direction="left" className="link item" text="EN/VN">
            <Dropdown.Menu>
              <Dropdown.Item
                key={'en'}
                content="English"
                onClick={(): void => {
                  i18n.changeLanguage('en');
                  dispatch(setLanguageGlobal('en'));
                }}
              />
              <Dropdown.Item
                key={'vi'}
                content="Tiếng Việt"
                onClick={(): void => {
                  i18n.changeLanguage('vn');
                  dispatch(setLanguageGlobal('vn'));
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
      ) : null}
    </Wrapper>
  ) : null;
};

export default AppBar;
