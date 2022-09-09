import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Popup, Dropdown } from 'semantic-ui-react';
import { setFormType } from '@admin/manage-customer/slices/customer';
import { useDispatch } from '@app/hooks';

const StyledIconButtonWrapper = styled.span`
  margin-left: 4px !important;
`;

interface Option {
  key: string;
  text: string;
  value: number;
}

export interface Props {
  icon: string;
  title: string;
  options: Option[];
}

const DropdownAction: (props: PropsWithChildren<Props>) => JSX.Element = ({
  icon,
  title,
  options,
}) => {
  const dispatch = useDispatch();

  return (
    <Popup
      pinned
      inverted
      size="tiny"
      content={title}
      position="top center"
      trigger={
        <StyledIconButtonWrapper>
          <Dropdown
            text="Form xét nghiệm"
            icon={icon}
            floating
            labeled
            button
            className="icon"
            options={options}
            onChange={(e, data) => {
              dispatch(setFormType(data.value));
            }}
          />
        </StyledIconButtonWrapper>
      }
    />
  );
};

export default DropdownAction;
