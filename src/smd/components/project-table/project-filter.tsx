import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

const Wrapper = styled(Grid)`
  margin: 0 !important;
  background: white;

  & > div.row {
    padding: 2px 0 !important;
  }
  & > div.row:first-child {
    padding-bottom: 2px !important;
  }
  & > div.row:last-child {
    padding-top: 2px !important;
  }
  & div.row,
  & div.column {
    font-weight: 600;
  }
  & > div.row > div.column {
    padding: 4px !important;
  }
  & > div.row > div.column:first-child {
    padding-left: 0 !important;
  }
  & > div.row > div.column:last-child {
    padding-right: 0 !important;
  }
  & > div.row:first-child {
    padding-bottom: 0;
  }
  & > div.row:last-child {
    padding-top: 0;
  }
`;

const StyledButton = styled(Form.Button)`
  margin-top: 4px !important;
  margin-bottom: 20px !important;
  padding-left: 0 !important;
  padding-right: 4px !important;
`;
interface Props {
  onChange: (data: { searchValue: string }) => void;
}
const ProjectFilter: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>();

  const onSearch = useCallback(() => {
    onChange({
      searchValue: searchValue ?? '',
    });
  }, [onChange, searchValue]);

  const onReset = () => {
    setSearchValue('');
    onChange({
      searchValue: '',
    });
  };

  return (
    <Wrapper>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Form.Input
            fluid
            value={searchValue || ''}
            label={t('Search by project name').toString()}
            onChange={(_, { value: v }): void => {
              setSearchValue(v);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <StyledButton
        primary
        labelPosition="right"
        icon="sync"
        content={t('Reset').toString()}
        onClick={onReset}
      />
      <StyledButton
        color="twitter"
        labelPosition="right"
        icon="filter"
        content={t('Apply').toString()}
        onClick={onSearch}
      />
    </Wrapper>
  );
};

export default ProjectFilter;
