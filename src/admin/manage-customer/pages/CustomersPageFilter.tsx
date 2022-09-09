import React, {
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Tab } from 'semantic-ui-react';
import ReceivedTable from '../components/tab/receivedTab/ReceivedTable';
import { SemanticShorthandItem } from 'semantic-ui-react/dist/commonjs/generic';
import ManagingTable from '../components/tab/managingTab/ManagingTable';
import DhealthTable from '../components/tab/D-healthTab/D-healthTable';

interface PaneProps {
  pane?: SemanticShorthandItem<any>;
  menuItem?: any;
  render?: (() => React.ReactNode) | undefined;
}


const CustomersPageFilter: React.FC = () => {
  const { t } = useTranslation();

  const prEpPanes: PaneProps[] = useMemo((): PaneProps[] =>
    [
      {
        menuItem: t('Waiting to receive (Another facility has moved in)'), render: () =>
          <Tab.Pane attached={false}>
            <ReceivedTable></ReceivedTable>
          </Tab.Pane>
      },

      {
        menuItem: t('Managing'), render: () =>
          <Tab.Pane attached={false}>
            <ManagingTable></ManagingTable>
          </Tab.Pane>
      },

      {
        menuItem: t('D-health Customer'), render: () =>
          <Tab.Pane attached={false}>
            <DhealthTable></DhealthTable>
          </Tab.Pane>
      },

    ]
    , [t])
  return (
    <>
      <Tab menu={{ pointing: true }} panes={prEpPanes} />
    </>
  )
}

export default CustomersPageFilter;