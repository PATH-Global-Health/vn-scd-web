/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@app/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CollectionResponse, ObjectResponse, Project } from '@smd/models';
import { showSuccessToast, showErrorToast } from '@smd/utils/helper';

interface State {
  projectData: CollectionResponse<Project>;
  getProjectsLoading: boolean;
  projectInfo: Project | null;
  getProjectByTokenLoaing: boolean;
  createProjectLoading: boolean;
  updateProjectLoading: boolean;
  deleteProjectLoading: boolean;
}

const defaultCollectionResponse = {
  data: [],
  errorMessage: '',
  failed: '',
  pageCount: 0,
  succeed: true,
};

const initialState: State = {
  projectData: defaultCollectionResponse,
  projectInfo: null,
  getProjectByTokenLoaing: false,
  getProjectsLoading: false,
  createProjectLoading: false,
  updateProjectLoading: false,
  deleteProjectLoading: false,
};

export const getProjects = createAsyncThunk(
  'smd/project/getProjects',
  async (arg: { pageSize: number; pageIndex: number, searchValue?: string }) => {
    const result = await httpClient.get({
      url: (al) => al.smd.project.get,
      params: { ...arg },
    });
    return result.data as CollectionResponse<Project>;
  },
);

export const getProjectByToken = createAsyncThunk(
  'smd/project/getProjectByToken',
  async () => {
    const result = await httpClient.get({
      url: (al) => al.smd.project.getByToken,
    });
    return result.data as ObjectResponse<Project>;
  },
);

export const createProject = createAsyncThunk(
  'smd/project/createProject',
  async (data: Project, { rejectWithValue }) => {
    try {
      const result = await httpClient.post({
        url: (al) => al.smd.project.create,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Project>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const updateProject = createAsyncThunk(
  'smd/project/updateProject',
  async (data: Project, { rejectWithValue }) => {
    try {
      const result = await httpClient.put({
        url: (al) => al.smd.project.update,
        data,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Project>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

export const deleteProject = createAsyncThunk(
  'smd/project/deleteProject',
  async (id: Project['id'], { rejectWithValue }) => {
    try {
      const result = await httpClient.delete({
        url: (al) => al.smd.project.delete + id,
      });
      showSuccessToast();
      return result.data as ObjectResponse<Project>;
    } catch (error) {
      showErrorToast(error);
      return rejectWithValue(error);
    }
  },
);

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjects.pending, (state) => {
      state.getProjectsLoading = true;
      state.projectData = defaultCollectionResponse;
    });
    builder.addCase(getProjects.fulfilled, (state, action) => {
      state.getProjectsLoading = false;
      state.projectData = action.payload;
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.getProjectsLoading = false;
    });

    builder.addCase(getProjectByToken.pending, (state) => {
      state.getProjectByTokenLoaing = true;
    });
    builder.addCase(getProjectByToken.fulfilled, (state, action) => {
      state.getProjectByTokenLoaing = false;
      state.projectInfo = action.payload.data;
    });
    builder.addCase(getProjectByToken.rejected, (state) => {
      state.getProjectByTokenLoaing = false;
    });

    builder.addCase(createProject.pending, (state) => {
      state.createProjectLoading = true;
    });
    builder.addCase(createProject.fulfilled, (state) => {
      state.createProjectLoading = false;
    });
    builder.addCase(createProject.rejected, (state) => {
      state.createProjectLoading = false;
    });

    builder.addCase(updateProject.pending, (state) => {
      state.updateProjectLoading = true;
    });
    builder.addCase(updateProject.fulfilled, (state) => {
      state.updateProjectLoading = false;
    });
    builder.addCase(updateProject.rejected, (state) => {
      state.updateProjectLoading = false;
    });

    builder.addCase(deleteProject.pending, (state) => {
      state.deleteProjectLoading = true;
    });
    builder.addCase(deleteProject.fulfilled, (state) => {
      state.deleteProjectLoading = false;
    });
    builder.addCase(deleteProject.rejected, (state) => {
      state.deleteProjectLoading = false;
    });
  },
});

export default project.reducer;
