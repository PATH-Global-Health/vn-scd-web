import React from 'react';
import styled from 'styled-components';

import { FiMaximize, FiMenu, FiMinimize } from 'react-icons/fi';

import { useDispatch, useSelector } from '@app/hooks';
import { toggleScreenSize } from '@app/slices/global';
import { Dropdown } from 'semantic-ui-react';

const pqmLinks = [
  {
    text: 'Tây Ninh',
    url:
      'https://201f54502deb422eaa1fbb05d2171846.quanlyhiv.vn/s/tay-ninh/app/dashboards#/view/1591d560-b93b-11eb-a03e-c9341dc395b8?embed=true',
  },
  {
    text: 'Tiền Giang',
    url:
      'https://201f54502deb422eaa1fbb05d2171845.quanlyhiv.vn/s/tien-giang/app/dashboards#/view/1591d560-b93b-11eb-a03e-c9341dc395b8?embed=true',
  },
  {
    text: 'Đồng Nai',
    url:
      'https://201f54502deb422eaa1fbb05d2171844.quanlyhiv.vn/s/dong-nai/app/dashboards#/view/1591d560-b93b-11eb-a03e-c9341dc395b8?embed=true',
  },
];

const Wrapper = styled.div`
  width: 100%;
  padding: 0 10px;
  margin: 8px 0;
  position: relative;
`;
const WrapperDropdown = styled.span`
  margin-right: 15px;
`;
const Title = styled.b`
  font-size: 30px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
`;
const Right = styled.span`
  float: right;
`;
const StyledFiMaximize = styled(FiMaximize)`
  cursor: pointer;
`;
const StyledFiMinimize = styled(FiMinimize)`
  cursor: pointer;
`;
const StyledFiMenu = styled(FiMenu)`
  cursor: pointer;
  margin-right: 5px;
`;

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title?: string;
}

const DashboardTitle: React.FC<Props> = ({ visible, setVisible, title }) => {
  const dispatch = useDispatch();
  const fullscreen = useSelector((s) => s.global.fullscreen);
  return (
    <Wrapper>
      {/* <StyledFiMenu size="25" onClick={() => setVisible(!visible)} /> */}
      <Title onClick={() => setVisible(!visible)}>
        {title ?? 'Subcontract Monitoring Dashboard'}
      </Title>
      <Right>
        <WrapperDropdown>
          <Dropdown as="a" floating text="PQM Links" className="mini">
            <Dropdown.Menu>
              {pqmLinks.map((l) => (
                <Dropdown.Item
                  key={l.text}
                  text={l.text}
                  onClick={() => window.open(l.url, '_blank')}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </WrapperDropdown>
        <span>
          {!fullscreen ? (
            <StyledFiMaximize
              size="20"
              onClick={() => dispatch(toggleScreenSize(true))}
            />
          ) : (
            <StyledFiMinimize
              size="20"
              onClick={() => dispatch(toggleScreenSize(false))}
            />
          )}
        </span>
      </Right>
    </Wrapper>
  );
};

export default DashboardTitle;
