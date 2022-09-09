import React, { PropsWithChildren, useMemo } from 'react';
import styled from 'styled-components';
import { Button, SemanticCOLORS, Popup } from 'semantic-ui-react';

const StyledIconButtonWrapper = styled.span`
  margin-left: 4px !important;
`;

const IconButton = styled(Button)`
  padding: 8px !important;
  line-height: 0 !important;
  margin-right: 0 !important;
`;

export interface RowAction<T> {
  icon: JSX.Element;
  color?: SemanticCOLORS;
  title: string;
  onClick: (data: T) => void;
  hidden?: boolean | ((data: T) => boolean);
  disabled?: boolean | ((data: T) => boolean);
}

export interface TableAction<T> {
  icon: JSX.Element;
  color?: SemanticCOLORS;
  title: string;
  onClick: (data: T[]) => void;
  hidden?: boolean | ((data: T[]) => boolean);
  disabled?: boolean | ((data: T[]) => boolean);
}

interface Option {
  title: string;
  disabled?: boolean;
  hidden?: boolean;
  onClick: () => void;
}

export interface DropdownAction {
  icon: JSX.Element;
  color?: SemanticCOLORS;
  title: string;
  options: Option[];
  hidden?: boolean;
  disabled?: boolean;
}

interface Props<T extends object> extends RowAction<T> {
  data: T;
}

const Action: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const {
    icon,
    color = 'black',
    title,
    onClick,
    disabled: disabledProp = false,
    hidden: hiddenProp = false,
    data,
  } = props;

  const disabled = useMemo(() => {
    if (typeof disabledProp === 'function') {
      return disabledProp(data);
    }
    return disabledProp;
  }, [data, disabledProp]);

  const hidden = useMemo(() => {
    if (typeof hiddenProp === 'function') {
      return hiddenProp(data);
    }
    return hiddenProp;
  }, [data, hiddenProp]);

  return (
    <>
      {!hidden && (
        <Popup
          pinned
          inverted
          size="tiny"
          content={title}
          position="top center"
          trigger={
            <StyledIconButtonWrapper>
              <IconButton
                basic
                icon={icon}
                color={color}
                disabled={disabled}
                onClick={(e: Event): void => {
                  e.stopPropagation();
                  onClick(data);
                }}
              />
            </StyledIconButtonWrapper>
          }
        />
      )}
    </>
  );
};

export default Action;
