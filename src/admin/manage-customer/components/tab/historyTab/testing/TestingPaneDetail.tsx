/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  Grid,
  Label,
  Modal,
} from 'semantic-ui-react';
import moment from 'moment';

import InfoRow from '@app/components/InfoRow';
import { Customer, TestingHistory } from '@admin/manage-customer/models/customer';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TestingHistory;
  info: Customer;
  onClose: () => void;
}

const TestingPaneDetail: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data } = props;
  return (
    <Modal
      open={Boolean(data)}
      onClose={props.onClose}
    >
      <Modal.Header>
        {data && (
          <Label
            basic
            size="large"
            content={data?.type === 1 ? t('Lay test') :
              data?.type === 2 ? t('Viral load test') :
                data?.type === 3 ? t('CD4 test') :
                  data?.type === 4 ? t('Recency test') :
                    t('Confirmatory test')}
          />
        )}
      </Modal.Header>
      <Modal.Content>

        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <InfoRow
                label={t('Public HIV examination date')}
                content={data?.hivPublicExaminationDate === 0 ? '' : moment(data?.hivPublicExaminationDate).format('YYYY-MM-DD')}
              />
              <InfoRow label={t('Public examination order')} content={data?.publicExaminationOrder} />
              <InfoRow label={t('Examination form')} content={data?.examinationForm === 0 ? t('CBO do test for customer') :
                data?.examinationForm === 1 ? t('Customer test by themself with support') :
                  data?.examinationForm === 2 ? t('Customer test by themself without support') : ''} />

              <InfoRow
                label={t('Testing date')}
                content={!data?.testingDate ? '' : moment(data?.testingDate).format('YYYY-MM-DD')}
              />
              <InfoRow
                label={t('Sample date')}
                content={data?.takenDate === 0 ? '' : moment(data?.takenDate).format('YYYY-MM-DD')}
              />
              <InfoRow
                label={t('Result date')}
                content={!data?.resultDate ? '' : moment(data?.resultDate).format('YYYY-MM-DD')}
              />
            </Grid.Column>
            <Grid.Column>
              <InfoRow label={t('Reception code')} content={data?.receptionId} />
              <InfoRow label={t('Staff')} content={data?.employeeName} />
              <InfoRow label={t('Examination code')} content={data?.code} />
              <InfoRow label={t('Viral load')} content={data?.viralLoad === -1 ? '' : data?.viralLoad + ''} />
              <InfoRow label={t('Result')} content={data?.resultTesting} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default TestingPaneDetail;
