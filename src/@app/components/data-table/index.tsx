/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PropsWithChildren, useMemo, useEffect, useState } from 'react';
import {
  Table,
  Header,
  Dimmer,
  Loader,
  Button,
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
  useTable,
  usePagination,
  useExpanded,
  useRowSelect,
  useGroupBy,
  useSortBy,
  UseExpandedState,
  UsePaginationState,
  UseGroupByColumnProps,
  UseGroupByCellProps,
  UseGroupByRowProps,
  UseExpandedRowProps,
  UseSortByColumnProps,
} from 'react-table';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import Pagination from './Pagination';
import ExpanderCell from './ExpanderCell';
import HeaderCheckbox from './HeaderCheckbox';
import RowCheckbox from './RowCheckbox';
import Action from './Action';
import SearchBar, { filterArray } from '../SearchBar';
import {
  Props,
  Column as IColumn,
  TableOptions,
  DataTableInstance as IDataTableInstance,
} from './types';

// #region styled
const Wrapper = styled.div`
  position: relative;
  .ui.sortable.table thead th {
    border-left: none;
  }
`;
const TableWrapper = styled.div`
  overflow: ${({ className }) =>
    className?.includes('scrollable') ? 'auto' : ''};
  table {
    margin-top: 0 !important;
  }
  .pointer {
    cursor: pointer;
  }
`;

interface CellProp {
  color: string;
  weight: string;
}

const renderCell = (value: React.ReactNode): CellProp => {
  let style: CellProp = {
    color: '',
    weight: '',
  };
  if (value && typeof value === 'string' && value.includes('%')) {
    const v = Number(value.substring(0, value.length - 1));
    if (v > 0 && v < 60) {
      style = {
        color: 'red',
        weight: 'bold',
      };
    }
    if (v >= 60 && v < 80) {
      style = {
        color: 'gold',
        weight: 'bold',
      };
    }
    if (v >= 80 && v < 100) {
      style = {
        color: 'green',
        weight: 'bold',
      };
    }
    if (v >= 100) {
      style = {
        color: 'blue',
        weight: 'bold',
      };
    }
  }
  return style;
};

const TableCell = styled(Table.Cell)`
  color: ${({ smd, content }) => (smd ? renderCell(content).color : '')};
  font-weight: ${({ smd, content }) => (smd ? renderCell(content).weight : '')};
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
const StyledIconButton = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 3px !important;
  background: transparent !important;
`;
const iconButton = (Icon: React.FC, props: object) => (
  <StyledIconButton icon={<Icon />} {...props} />
);
// #endregion

const DataTable: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  // #region columns and data
  const { t } = useTranslation();
  const { data, columns: propColumns, pageCount: controlledPageCount } = props;

  type T = typeof data[0];
  type DataTableInstance = IDataTableInstance<T>;

  const { subComponent } = props;
  const columns = useMemo(
    () =>
      propColumns.map((c) => ({
        ...c,
        Header: c.header ?? c.Header,
        Aggregated: c.renderAggregated,
      })),
    [propColumns],
  );

  const [searchValue, setSearchValue] = useState('');
  const filteredData = useMemo(() => filterArray(data, searchValue), [
    data,
    searchValue,
  ]);

  const options: TableOptions<T> = {
    columns,
    data: filteredData,

    initialState: {},

    pageCount: controlledPageCount,
    manualPagination: Boolean(controlledPageCount),
    paginateExpandedRows: false,
    autoResetPage: false,
  };

  const { selectable = false, rowActions = [] } = props;
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
            Cell: (table: DataTableInstance) =>
              rowActions.map((a) => (
                <Action
                  key={`${a.title}|${a.color ?? 'rainbow'}`}
                  data={table.row.original}
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
  ) as DataTableInstance;
  // #endregion

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

  // #region pagination
  const {
    pageCount,
    gotoPage,
    setPageSize,
    state: paginationState,
  } = tableInstance;
  const { pageIndex, pageSize } = paginationState as UsePaginationState<T>;
  const { noPaging = false, onPaginationChange } = props;
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize });
    }
  }, [onPaginationChange, pageIndex, pageSize]);

  const paginationNode = useMemo(
    () =>
      !noPaging ? (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageCount}
          totalCount={data.length}
          gotoPage={gotoPage}
          setPageSize={setPageSize}
        />
      ) : null,
    [
      noPaging,
      pageIndex,
      pageSize,
      pageCount,
      data.length,
      gotoPage,
      setPageSize,
    ],
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
            data={selectedFlatRows.map((r) => r.original)}
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
    [tableActions, selectedFlatRows, selectable, t],
  );
  // #endregion

  // Custom dropdownActions render
  // const { selectedFlatRows } = tableInstance;
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
    prepareRow,
    page,
    visibleColumns,
    state: tableState,
  } = tableInstance;

  const { expanded } = tableState as UseExpandedState<T>;
  const expandedRowKeys = useMemo(
    () => Object.keys(expanded).map((k) => `row_${k}`),
    [expanded],
  );
  const {
    title,
    scrollable = false,
    striped = false,
    loading = false,
    groupBy = false,
    sortBy = false,
    onRowClick,
  } = props;

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
      <TableWrapper className={scrollable ? 'scrollable' : ''}>
        <Table
          sortable
          singleLine={scrollable}
          size="small"
          compact="very"
          striped={striped}
          role={getTableProps().role}
          selectable={Boolean(onRowClick)}
        >
          <Table.Header>
            {headerGroups.map((hg) => {
              const {
                key: headerGroupKey,
                role: headerGroupRole,
              } = hg.getHeaderGroupProps();

              return (
                <Table.Row key={headerGroupKey} role={headerGroupRole}>
                  {hg.headers.map((c) => {
                    const { key: rowKey, role: rowRole } = c.getHeaderProps();
                    // prettier-ignore
                    const columnWithGroupBy = c as unknown as UseGroupByColumnProps<T>;
                    const columnWithSortBy = (c as unknown) as UseSortByColumnProps<
                      T
                    >;

                    return (
                      <Table.HeaderCell
                        key={rowKey}
                        role={rowRole}
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
              );
            })}
          </Table.Header>
          <Table.Body role={getTableBodyProps().role}>
            {page.map((r) => {
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
                        onRowClick(r.original);
                      }
                    }}
                  >
                    {r.cells.map((c) => {
                      const { key: cKey, role: cRole } = c.getCellProps();
                      const accessor = (cKey as string).split('_')[2];
                      const render = propColumns.find(
                        (pc) => pc.accessor === accessor,
                      )?.render;

                      // prettier-ignore
                      const cellWithGroupBy = (c as unknown) as UseGroupByCellProps<T>;
                      // prettier-ignore
                      const rowWithGroupBy = (r as unknown) as UseGroupByRowProps<T>;
                      // prettier-ignore
                      const rowWithExpanded = (r as unknown) as UseExpandedRowProps<T>;

                      const cellNode = render
                        ? render(c.row.original)
                        : c.render('Cell');

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
                            {cellNode}
                            {`(${rowWithGroupBy.subRows.length})`}
                          </>
                        );
                      } else if (cellWithGroupBy.isAggregated) {
                        content = c.render('Aggregated');
                      } else if (!cellWithGroupBy.isPlaceholder) {
                        content = cellNode;
                      }

                      const textAlign = `${cKey}`.includes('action')
                        ? 'right'
                        : 'left';

                      return (
                        <TableCell
                          key={cKey}
                          role={cRole}
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
                        content={subComponent(r.original)}
                      />
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
          {paginationNode}
        </Table>
      </TableWrapper>
    </Wrapper>
  );
  // #endregion
};

export type Column<T> = IColumn<T>;

// (DataTable as any).whyDidYouRender = true;
export default DataTable;
