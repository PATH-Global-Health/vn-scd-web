import { ReactNode } from 'react';
import {
  AggregatedValue,
  DefaultAggregators,
  TableInstance,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UseRowSelectInstanceProps,
  UseTableCellProps,
  UseTableOptions,
  UseSortByOptions,
  UseSortByInstanceProps,
} from 'react-table';

import { RowAction, TableAction, DropdownAction } from './Action';

export interface Column<T> {
  header?: string;
  Header?: string;
  disableGroupBy?: boolean;
  columns?: Column<T>[];

  accessor: keyof Partial<T>;
  render?: (d: T) => ReactNode;
  aggregate?: DefaultAggregators;
  renderAggregated?: (props: { value: AggregatedValue }) => ReactNode;
}

export interface Props<T extends object> {
  title?: string | JSX.Element;
  striped?: boolean;
  loading?: boolean;
  scrollable?: boolean;

  columns: Column<T>[];
  data: T[];

  search?: boolean;
  onSearch?: (searchValue: string) => void;

  selectable?: boolean;
  rowActions?: RowAction<T>[];
  tableActions?: TableAction<T>[];
  dropdownActions?: DropdownAction[];

  groupBy?: boolean;
  sortBy?: boolean;

  onRowClick?: (data: T) => void;

  subComponent?: (data: T) => JSX.Element;

  noPaging?: boolean;
  onPaginationChange?: (param: { pageIndex: number; pageSize: number }) => void;
  pageCount?: number;
}

export type TableOptions<T extends object> = UseTableOptions<T> &
  UsePaginationOptions<T> &
  UseExpandedOptions<T> &
  UseSortByOptions<T> &
  UseGroupByOptions<T>;

export type DataTableInstance<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseExpandedInstanceProps<T> &
  UseTableCellProps<T> &
  UseGroupByInstanceProps<T> &
  UseSortByInstanceProps<T> &
  UseRowSelectInstanceProps<T>;
