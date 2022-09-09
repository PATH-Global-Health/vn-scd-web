/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@app/utils';
import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  Report,
  Indicator,
  ObjectResponse,
  CollectionResponse,
  IndicatorSummary,
  BarChartResponse,
  Project,
  CBO,
  EfficiencyRecord,
  ImportType,
  GroupByType,
  ErrorResponse,
  ReportHistory,
  AllowImportType,
} from '@smd/models';
import { showSuccessToast, showErrorToast } from '@smd/utils/helper';

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

interface ImportError {
  data: string[];
  failed: string[];
  errorMessage: string;
}

interface State {
  reportData: CollectionResponse<Report>;
  getReportsLoading: boolean;
  reportHistoryData: CollectionResponse<ReportHistory>;
  getReportHistoriesLoading: boolean;
  createReportLoading: boolean;
  updateReportLoading: boolean;
  deleteReportLoading: boolean;
  importReportLoading: boolean;
  importError: ImportError | null;
  summaryList: IndicatorSummary[];
  getSummaryLoading: boolean;
  getBarChartLoading: boolean;
  efficiencyList: EfficiencyRecord[];
  getEfficiencyLoading: boolean;
}

const initialState: State = {
  reportData: defaultCollectionResponse,
  getReportsLoading: false,
  reportHistoryData: defaultCollectionResponse,
  getReportHistoriesLoading: false,
  createReportLoading: false,
  updateReportLoading: false,
  deleteReportLoading: false,
  importReportLoading: false,
  summaryList: [],
  getSummaryLoading: false,
  getBarChartLoading: false,
  efficiencyList: [],
  getEfficiencyLoading: false,
  importError: null,
};

export const getReports = createAsyncThunk(
  'smd/report/getReports',
  async (data: object) => {
    const result = await httpClient.put({
      url: (al) => al.smd.report.get,
      data,
    });
    return result.data as CollectionResponse<Report>;
  },
);

export const getReportHistories = createAsyncThunk(
  'smd/report/getReportHistories',
  async (arg: object) => {
    const result = await httpClient.get({
      url: (al) => al.smd.report.getHistories,
      params: { ...arg },
    });
    return result.data as CollectionResponse<ReportHistory>;
  },
);

export const createReport = createAsyncThunk(
  'smd/report/createReport',
  async (data: Report, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.report.create,
        data,
      });
      showSuccessToast('modifyReport');
      return result.data.data as ObjectResponse<Report>;
    } catch (error) {
      showErrorToast(error, 'modifyReport');
      return rejectWithValue(error);
    }
  },
);

export const updateReport = createAsyncThunk(
  'smd/report/updateReport',
  async (data: Report, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.report.update,
        data,
      });
      showSuccessToast('modifyReport');
      return result.data as ObjectResponse<Report>;
    } catch (error) {
      showErrorToast(error, 'modifyReport');
      return rejectWithValue(error);
    }
  },
);

export const deleteReport = createAsyncThunk(
  'smd/report/deleteReport',
  async (id: Report['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.report.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Report>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const getEfficiency = createAsyncThunk(
  'smd/report/getEfficiency',
  async (data: object, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.report.efficiency,
        data,
      });
      return result.data.data as EfficiencyRecord[];
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const getSummary = createAsyncThunk(
  'smd/report/getSummary',
  async (data: { indicators: Indicator['id'][] }, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.report.summary,
        data,
      });
      return result.data.data as IndicatorSummary[];
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const getBarChart = createAsyncThunk(
  'smd/report/getBarChart',
  async (
    data: {
      indicators: Indicator['id'][];
      psnUs: Project['id'][];
      implementingPartners: string[];
      cbOs: CBO['id'][];
      groupByType: GroupByType;
      pageIndex: number;
      pageSize: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.report.barChart,
        data,
      });
      const chartData = result.data.data as BarChartResponse[];
      if (data.groupByType === GroupByType.TIME) {
        chartData.sort((f, s) => {
          return f.label.split('/').reverse().join('') >
            s.label.split('/').reverse().join('')
            ? 1
            : -1;
        });
      }
      return chartData;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const clearImportErrorCR: CR<void> = (state) => ({
  ...state,
  importError: null,
});

export const importReport = createAsyncThunk(
  'smd/report/importReport',
  async (
    arg: {
      allowInputType: number;
      importByCBO: boolean;
      readType: ImportType;
      forceDelete: boolean;
      data: FormData;
    },
    { rejectWithValue },
  ) => {
    try {
      const { allowInputType, importByCBO, readType, forceDelete } = arg;
      const link = () => {
        if (importByCBO) {
          if (allowInputType === AllowImportType.SYSTHESIS) {
            return 'importByCBO';
          }
          return 'importRawByCBO';
        }
        if (allowInputType === AllowImportType.SYSTHESIS) {
          return 'importByProject';
        }
        return 'importRawByProject';
      };
      const result = await httpClient.post({
        url: (al) => al.smd.report[link()],
        params: { readType, forceDelete },
        data: arg.data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Report>;
    } catch (error) {
      const e = error as ErrorResponse;
      return rejectWithValue(e.response.data);
    }
  },
);

const report = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearImportError: clearImportErrorCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getReports.pending, (state) => {
      state.getReportsLoading = true;
    });
    builder.addCase(getReports.fulfilled, (state, action) => {
      state.getReportsLoading = false;
      state.reportData = action.payload;
    });
    builder.addCase(getReports.rejected, (state) => {
      state.getReportsLoading = false;
    });

    builder.addCase(createReport.pending, (state) => {
      state.createReportLoading = true;
    });
    builder.addCase(createReport.fulfilled, (state) => {
      state.createReportLoading = false;
    });
    builder.addCase(createReport.rejected, (state) => {
      state.createReportLoading = false;
    });

    builder.addCase(updateReport.pending, (state) => {
      state.updateReportLoading = true;
    });
    builder.addCase(updateReport.fulfilled, (state) => {
      state.updateReportLoading = false;
    });
    builder.addCase(updateReport.rejected, (state) => {
      state.updateReportLoading = false;
    });

    builder.addCase(deleteReport.pending, (state) => {
      state.deleteReportLoading = true;
    });
    builder.addCase(deleteReport.fulfilled, (state) => {
      state.deleteReportLoading = false;
    });
    builder.addCase(deleteReport.rejected, (state) => {
      state.deleteReportLoading = false;
    });

    builder.addCase(getBarChart.pending, (state) => {
      state.getBarChartLoading = true;
    });
    builder.addCase(getBarChart.fulfilled, (state) => {
      state.getBarChartLoading = false;
    });
    builder.addCase(getBarChart.rejected, (state) => {
      state.getBarChartLoading = false;
    });

    builder.addCase(getSummary.pending, (state) => {
      state.getSummaryLoading = true;
    });
    builder.addCase(getSummary.fulfilled, (state, action) => {
      state.getSummaryLoading = false;
      state.summaryList = action.payload;
    });
    builder.addCase(getSummary.rejected, (state) => {
      state.getSummaryLoading = false;
    });

    builder.addCase(getEfficiency.pending, (state) => {
      state.getEfficiencyLoading = true;
    });
    builder.addCase(getEfficiency.fulfilled, (state, action) => {
      state.getEfficiencyLoading = false;
      state.efficiencyList = action.payload;
    });
    builder.addCase(getEfficiency.rejected, (state) => {
      state.getEfficiencyLoading = false;
    });

    builder.addCase(importReport.pending, (state) => {
      state.importReportLoading = true;
    });
    builder.addCase(importReport.fulfilled, (state) => {
      state.importReportLoading = false;
    });
    builder.addCase(importReport.rejected, (state, action) => {
      state.importReportLoading = false;
      state.importError = action.payload as ImportError;
    });
  },
});

export const { clearImportError } = report.actions;

export default report.reducer;
