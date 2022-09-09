import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled, { css } from 'styled-components';

import { useSelector, useDispatch, useAuth } from '@app/hooks';
import { openComponentTab } from '@app/slices/global';
import { getGroup, getComponent } from '@app/utils/component-tree';
import { useTranslation } from 'react-i18next';

const StyledDropdown = styled(Dropdown)`
  ${(props: { selected?: boolean }) =>
    props.selected &&
    css`
      border-top: 2px solid !important;
      > .text {
        font-weight: 600 !important;
      }
    `}
`;

interface Props {
  groupKey: string;
  childrenList: Array<{
    key: string;
    permissionCode?: string;
  }>;
}

const MenuButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { groupKey, childrenList } = props;

  const { tabList } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const { hasPermission } = useAuth();
  const selectedGroup = getGroup(groupKey);

  return (
    <StyledDropdown
      className="link item"
      selected={tabList.some((e) => e.selected && e.groupKey === groupKey)}
      text={t(selectedGroup?.locale ?? '').toString()}
    >
      <Dropdown.Menu>
        {childrenList.map((ck) => {
          const c = getComponent(groupKey, ck.key);
          const hp =
            !ck.permissionCode ||
            (ck.permissionCode && hasPermission(ck.permissionCode));
          if (c && hp)
            return (
              <Dropdown.Item
                key={c.key}
                content={t(c.locale).toString()}
                onClick={(): void => {
                  dispatch(
                    openComponentTab({
                      groupKey,
                      key: c.key,
                    }),
                  );
                }}
              />
            );
          return null;
        })}
      </Dropdown.Menu>
    </StyledDropdown>
  );
};

export default MenuButton;
