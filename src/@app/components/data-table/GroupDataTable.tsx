/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PropsWithChildren, useMemo, useEffect, useState } from 'react';

import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import {
  Table,
  Button,
  Header,
  Dimmer,
  Loader,
  Popup,
  Dropdown,
} from 'semantic-ui-react';
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiChevronRight,
  FiCornerLeftUp,
  FiMinus,
  FiMinusSquare,
} from 'react-icons/fi';

import {
  Column,
  useTable,
  usePagination,
  useExpanded,
  useRowSelect,
  useGroupBy,
  useSortBy,
  UseExpandedState,
  UseGroupByColumnProps,
  UseGroupByCellProps,
  UseGroupByRowProps,
  UseExpandedRowProps,
  UseSortByColumnProps,
  UseGroupByState,
} from 'react-table';

import Action, { DropdownAction, RowAction, TableAction } from './Action';
import RowCheckbox from './RowCheckbox';
import HeaderCheckbox from './HeaderCheckbox';
import ExpanderCell from './ExpanderCell';

import SearchBar, { filterArray } from '../SearchBar';

const Wrapper = styled.div`
  position: relative;
  .ui.sortable.table thead th {
    border-left: none;
  }
`;
const TableWrapper = styled.div`
  table {
    margin-top: 0 !important;
  }
  .pointer {
    cursor: pointer;
  }
  & .text-bold {
    font-weight: bold !important;
  }
`;
const SearchBarWrapper = styled.div`
  margin-bottom: 8px;
`;
const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 8px 0;
`;
const TableHeader = styled(Header)`
  margin-bottom: 0 !important;
  font-size: 28px !important;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
`;
const ExpandCell = styled(Table.Cell)`
  background: rgba(34, 36, 38, 0.05);
  padding-left: 50px !important;
`;

const renderCell = (d: any): React.CSSProperties => {
  let style: React.CSSProperties = {
    color: 'black',
    background: '',
    fontWeight: 'normal',
  };
  const className = d.className as string;
  if (className.includes('Performance') && !className.includes(':')) {
    const v = Number(d?.content?.props.value);
    if (v >= 0 && v < 60) {
      style = {
        color: 'white',
        background: 'red',
        fontWeight: 'bold',
      };
    }
    if (v >= 60 && v < 80) {
      style = {
        color: 'black',
        background: 'gold',
        fontWeight: 'bold',
      };
    }
    if (v >= 80 && v < 100) {
      style = {
        color: 'white',
        background: 'green',
        fontWeight: 'bold',
      };
    }
    if (v >= 100) {
      style = {
        color: 'white',
        background: 'royalblue',
        fontWeight: 'bold',
      };
    }
  }
  return style;
};
const TableCell = styled(Table.Cell)`
  color: ${(props) => renderCell(props).color};
  background: ${(props) => renderCell(props).background};
  font-weight: ${(props) => renderCell(props).fontWeight};
`;
const StyledIconButton = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 3px !important;
  background: transparent !important;
`;
const iconButton = (Icon: React.FC, props: object) => (
  <StyledIconButton icon={<Icon />} {...props} />
);

// #region styled

interface Props<T> {
  title?: string | JSX.Element;
  striped?: boolean;
  loading?: boolean;
  groupBy?: boolean;
  sortBy?: boolean;
  footer?: boolean;
  selectable?: boolean;

  data: T[];
  columns: Column[];

  search?: boolean;
  onSearch?: (searchValue: string) => void;

  onRowClick?: (data: T) => void;
  rowActions?: RowAction<T>[];
  tableActions?: TableAction<T>[];
  dropdownActions?: DropdownAction[];

  subComponent?: (data: T) => JSX.Element;

  noPaging?: boolean;
  onPaginationChange?: (param: { pageIndex: number; pageSize: number }) => void;
  pageCount?: number;
}
const GroupDataTable: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const { t } = useTranslation();
  const { data, columns, pageCount: controlledPageCount } = props;

  type T = typeof data[0];

  const [searchValue, setSearchValue] = useState('');
  const filteredData = useMemo(() => filterArray(data, searchValue), [
    data,
    searchValue,
  ]);

  const options = {
    columns,
    data: filteredData,

    initialState: {},

    pageCount: controlledPageCount,
    manualPagination: Boolean(controlledPageCount),
    paginateExpandedRows: true,
    autoResetPage: false,
  };

  const { selectable = false, rowActions = [], subComponent } = props;

  const tableInstance = useTable(
    options,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (subComponent) {
        hooks.visibleColumns.push((visibleColumns) => [
          { id: 'expander', Header: () => null, Cell: ExpanderCell },
          ...visibleColumns,
        ]);
      }
      if (selectable) {
        hooks.visibleColumns.push((visibleColumns) => [
          { id: 'selection', Header: HeaderCheckbox, Cell: RowCheckbox },
          ...visibleColumns,
        ]);
      }
      if (rowActions.length > 0) {
        hooks.visibleColumns.push((visibleColumns) => [
          ...visibleColumns,
          {
            id: 'action',
            Header: () => null,
            Cell: (table) =>
              rowActions.map((a) => (
                <Action
                  key={`${a.title}|${a.color ?? 'rainbow'}`}
                  data={table.row.original as T}
                  icon={a.icon}
                  color={a.color}
                  title={a.title}
                  onClick={a.onClick}
                  hidden={a.hidden}
                  disabled={a.disabled}
                />
              )),
          },
        ]);
      }
    },
  );
  // #region search
  const { search = false, onSearch } = props;
  useEffect(() => {
    if (onSearch && searchValue) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const searchNode = useMemo(
    () =>
      search ? (
        <SearchBarWrapper>
          <SearchBar onChange={(v) => setSearchValue(v)} />
        </SearchBarWrapper>
      ) : null,
    [search],
  );
  // #endregion

  // #region selectable actions
  const { selectedFlatRows } = tableInstance;
  const { tableActions } = props;
  const tableActionsNode = useMemo(
    () => (
      <ActionsWrapper>
        {selectable && (
          <span>
            {`${t('Chosen')}: ${selectedFlatRows.length} ${t('line')}  `}
          </span>
        )}
        {tableActions?.map((a) => (
          <Action
            key={`${a.title}|${a.color ?? 'rainbow'}`}
            data={selectedFlatRows.map((r) => r.original as T)}
            icon={a.icon}
            color={a.color}
            title={a.title}
            onClick={a.onClick}
            hidden={a.hidden}
            disabled={a.disabled}
          />
        ))}
      </ActionsWrapper>
    ),
    // eslint-disable-next-line
    [tableActions, selectedFlatRows, selectable, t],
  );
  // #endregion

  // Custom dropdownActions render
  const { dropdownActions } = props;
  const dropdownActionNode = useMemo(
    () => (
      <div>
        {dropdownActions
          ?.filter((a) => !a.hidden)
          ?.map((a) => (
            <Popup
              inverted
              size="tiny"
              key={a.title}
              content={a.title}
              trigger={
                <Button.Group basic color={a.color} style={{ border: 'none' }}>
                  <Dropdown
                    button
                    icon={a.icon}
                    className="icon"
                    disabled={a.disabled}
                    style={{
                      padding: '8px 8px 5px',
                      marginLeft: '4px',
                    }}
                  >
                    <Dropdown.Menu>
                      {a.options
                        .filter((ac) => !ac.hidden)
                        .map((ac) => (
                          <Dropdown.Item
                            key={ac.title}
                            disabled={ac.disabled}
                            onClick={ac.onClick}
                          >
                            {ac.title}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Button.Group>
              }
            />
          ))}
      </div>
    ),
    [dropdownActions],
  );
  // #end custom

  // #region render
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    rows,
    visibleColumns,
    state: tableState,
  } = tableInstance;

  const { groupBy: groupByState, expanded } = tableState as UseExpandedState<
    T
  > &
    UseGroupByState<T>;
  const expandedRowKeys = useMemo(
    () => Object.keys(expanded).map((k) => `row_${k}`),
    [expanded],
  );

  const [hideFooter, setHideFooter] = useState(false);
  useEffect(() => {
    setHideFooter(groupByState.length !== 0);
  }, [groupByState]);

  const {
    title,
    // footer = false,
    striped = false,
    loading = false,
    groupBy = false,
    sortBy = false,
    onRowClick,
  } = props;

  // Render the UI for your table
  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>
      {searchNode}
      <ToolbarWrapper>
        {typeof title === 'string' && <TableHeader content={title} />}
        {typeof title !== 'string' && title}
        {tableActionsNode}
        {dropdownActionNode}
      </ToolbarWrapper>
      <TableWrapper>
        <Table
          sortable
          size="small"
          compact="very"
          striped={striped}
          {...getTableProps()}
          selectable={Boolean(onRowClick)}
        >
          <Table.Header>
            {headerGroups.map((hg) => (
              <Table.Row {...hg.getHeaderGroupProps()}>
                {hg.headers.map((c) => {
                  // prettier-ignore
                  const columnWithGroupBy = c as unknown as UseGroupByColumnProps<T>;
                  const columnWithSortBy = (c as unknown) as UseSortByColumnProps<
                    T
                  >;

                  return (
                    <Table.HeaderCell
                      {...c.getHeaderProps()}
                      content={
                        <>
                          {groupBy &&
                            columnWithGroupBy.canGroupBy &&
                            iconButton(
                              columnWithGroupBy.isGrouped
                                ? FiMinusSquare
                                : FiCornerLeftUp,
                              columnWithGroupBy.getGroupByToggleProps(),
                            )}
                          {c.render('Header')}
                          {sortBy &&
                            iconButton(
                              typeof columnWithSortBy.isSortedDesc ===
                                'undefined'
                                ? FiMinus
                                : columnWithSortBy.isSortedDesc
                                ? FiArrowDown
                                : FiArrowUp,
                              columnWithSortBy.getSortByToggleProps(),
                            )}
                        </>
                      }
                    />
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((r) => {
              prepareRow(r);
              const { key: rKey, role: rRole } = r.getRowProps();
              return (
                <React.Fragment key={rKey}>
                  <Table.Row
                    role={rRole}
                    className={
                      onRowClick && onRowClick.toString() !== '() => {}'
                        ? 'pointer'
                        : ''
                    }
                    onClick={() => {
                      if (onRowClick && r.original) {
                        onRowClick(r.original as T);
                      }
                    }}
                  >
                    {r.cells.map((c) => {
                      const { key: cKey, role: cRole } = c.getCellProps();

                      // prettier-ignore
                      const cellWithGroupBy = (c as unknown) as UseGroupByCellProps<T>;
                      // prettier-ignore
                      const rowWithGroupBy = (r as unknown) as UseGroupByRowProps<T>;
                      // prettier-ignore
                      const rowWithExpanded = (r as unknown) as UseExpandedRowProps<T>;

                      let content: React.ReactNode = null;
                      if (groupBy && cellWithGroupBy.isGrouped) {
                        content = (
                          <>
                            {iconButton(
                              rowWithExpanded.isExpanded
                                ? FiChevronDown
                                : FiChevronRight,
                              rowWithExpanded.getToggleRowExpandedProps(),
                            )}
                            {c.render('Cell')}
                            {`(${rowWithGroupBy.subRows.length})`}
                          </>
                        );
                      } else if (cellWithGroupBy.isAggregated) {
                        content = c.render('Aggregated');
                      } else if (!cellWithGroupBy.isPlaceholder) {
                        content = c.render('Cell');
                      }

                      const textAlign = `${cKey}`.includes('action')
                        ? 'right'
                        : 'left';

                      return (
                        <TableCell
                          key={cKey}
                          role={cRole}
                          className={cKey}
                          content={content}
                          textAlign={textAlign}
                        />
                      );
                    })}
                  </Table.Row>

                  {/* expand */}
                  {subComponent && expandedRowKeys.includes(`${rKey}`) && (
                    <Table.Row>
                      <ExpandCell
                        colSpan={visibleColumns.length}
                        content={subComponent(r.original as T)}
                      />
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
          {!hideFooter && (
            <Table.Footer>
              {footerGroups.map((footerGroup) => {
                const {
                  key: footerGroupKey,
                } = footerGroup.getFooterGroupProps();
                if (
                  footerGroup.headers.some((header) => header.parent) ||
                  footerGroup.headers.some(
                    (header) =>
                      header.Footer && !header.Footer.toString().includes('()'),
                  )
                ) {
                  return (
                    <Table.Row key={footerGroupKey}>
                      {footerGroup.headers.map((column, i) => {
                        // const mappedData = data as EfficiencyRecord[];
                        // let performance = '';
                        // if (mappedData.length) {
                        //   const getTotal = (key: keyof EfficiencyRecord) => {
                        //     return Number(
                        //       mappedData
                        //         .map((e) => e[key])
                        //         .filter((e) => Number(e))
                        //         .reduce((a, b) => Number(a) + Number(b), 0),
                        //     );
                        //   };
                        //   switch (column.id) {
                        //     case 'arvPerformance':
                        //       performance = `${(
                        //         (getTotal('tx_new__1') /
                        //           getTotal('tx_new__1Target')) *
                        //         100
                        //       ).toFixed()}%`;
                        //       break;
                        //     case 'prepPerformance':
                        //       performance = `${(
                        //         (getTotal('prep_new__2') /
                        //           getTotal('prep_new__2Target')) *
                        //         100
                        //       ).toFixed()}%`;
                        //       break;
                        //     case 'paymentPerformance':
                        //       performance = `${(
                        //         (getTotal('payment') /
                        //           getTotal('paymentTarget')) *
                        //         100
                        //       ).toFixed()}%`;
                        //       break;
                        //     default:
                        //       break;
                        //   }
                        // }
                        const { key: headerCellKey } = column.getFooterProps();
                        if (i === 0) {
                          return (
                            <Table.HeaderCell
                              key={headerCellKey}
                              className="text-bold"
                              content={t('Total').toString()}
                            />
                          );
                        }
                        return (
                          <Table.HeaderCell
                            {...column.getFooterProps()}
                            key={headerCellKey}
                            className={
                              column.columns
                                ? 'text-center text-bold'
                                : 'text-bold'
                            }
                            collapsing={['selection', 'expander'].includes(
                              column.id,
                            )}
                            content={
                              // column.Footer
                              //   ? column.id.includes('Performance')
                              //     ? performance
                              //     : column.render('Footer')
                              //   : ''
                              column.Footer ? column.render('Footer') : ''
                            }
                          />
                        );
                      })}
                    </Table.Row>
                  );
                }
                return <Table.Row key={footerGroupKey} />;
              })}
            </Table.Footer>
          )}
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

// (GroupDataTable as any).whyDidYouRender = true;
export default GroupDataTable;
