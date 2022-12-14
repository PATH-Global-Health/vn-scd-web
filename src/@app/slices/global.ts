import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface ComponentTab {
  groupKey: string;
  key: string;
  selected?: boolean;
  locked?: boolean;
  refreshCallback?: () => void;
}

interface State {
  // language: string;
  tabList: ComponentTab[];
  fullscreen: boolean;
  confirmation?: {
    message: string;
    callback: () => void;
  };
  error?: {
    message: string;
    title: string;
    data: string[];
    callback: () => void;
  };
}

const initialState: State = {
  fullscreen: false,
  tabList: [],
  // language: '',
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

interface ComponentKeySet {
  groupKey: string;
  key: string;
}

const openComponentTabCR: CR<ComponentKeySet> = (state, action) => {
  const { key, groupKey } = action.payload;

  const existed = state.tabList.find(
    (c) => c.key === key && c.groupKey === groupKey,
  );
  const lockedTab = state.tabList.find((e) => e.locked);

  if (!existed) {
    return {
      ...state,
      tabList: [
        ...state.tabList.map((e) => ({
          ...e,
          selected:
            lockedTab?.groupKey === e.groupKey && lockedTab?.key === e.key,
        })),
        {
          groupKey,
          key,
          selected: !lockedTab,
          locked: false,
        },
      ],
    };
  }

  return {
    ...state,
    tabList: state.tabList.map((e) => ({
      ...e,
      selected: lockedTab
        ? e.locked // if there is a locked tab => selected = false except for the locked tab itself
        : e.groupKey === groupKey && e.key === key,
      locked: e.locked,
    })),
  };
};

const closeComponentTableCR: CR<ComponentKeySet> = (state, action) => {
  const { groupKey, key } = action.payload;
  let filteredList = state.tabList.filter(
    (c) => !(c.key === key && c.groupKey === groupKey),
  );
  const noSelected = filteredList.every((e) => !e.selected);
  if (noSelected) {
    filteredList = filteredList.map((e, i) => {
      if (i !== filteredList.length - 1) {
        return e;
      }
      return { ...e, selected: true };
    });
  }

  return {
    ...state,
    tabList: filteredList,
  };
};

const toggleLockComponentTabCR: CR<ComponentKeySet> = (state, action) => {
  const { groupKey, key } = action.payload;
  return {
    ...state,
    tabList: state.tabList.map((e) => ({
      ...e,
      locked: e.groupKey === groupKey && e.key === key ? !e.locked : false,
      selected: e.groupKey === groupKey && e.key === key,
    })),
  };
};

const toggleScreenSizeCR: CR<boolean> = (state, action) => {
  return {
    ...state,
    fullscreen: action.payload,
  };
};

interface AddComponentRefreshCallback extends ComponentKeySet {
  callback: () => void;
}

const addComponentRefreshCallbackCR: CR<AddComponentRefreshCallback> = (
  state,
  action,
) => {
  const { groupKey, key, callback } = action.payload;
  return {
    ...state,
    tabList: state.tabList.map((e) => ({
      ...e,
      refreshCallback:
        e.groupKey === groupKey && e.key === key ? callback : e.refreshCallback,
    })),
  };
};

interface AddConfirmCallback {
  message: string;
  callback: () => void;
}
const addConfirmCallbackCR: CR<AddConfirmCallback> = (state, action) => ({
  ...state,
  confirmation: {
    ...action.payload,
  },
});

const clearConfirmCallbackCR: CR<void> = (state) => ({
  ...state,
  confirmation: undefined,
});

interface AddErrorCallback {
  title: string;
  message: string;
  data: string[];
  callback: () => void;
}
const addErrorCallbackCR: CR<AddErrorCallback> = (state, action) => ({
  ...state,
  error: {
    ...action.payload,
  },
});

const clearErrorCallbackCR: CR<void> = (state) => ({
  ...state,
  error: undefined,
});

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    openComponentTab: openComponentTabCR,
    closeComponentTab: closeComponentTableCR,
    toggleLockComponentTab: toggleLockComponentTabCR,
    toggleScreenSize: toggleScreenSizeCR,
    addComponentRefreshCallback: addComponentRefreshCallbackCR,
    addConfirmCallback: addConfirmCallbackCR,
    clearConfirmCallback: clearConfirmCallbackCR,
    addErrorCallback: addErrorCallbackCR,
    clearErrorCallback: clearErrorCallbackCR,
    // setLanguageGlobal: (state, action) => {
    //   state.language = action.payload;
    // },
  },
});

export const {
  openComponentTab,
  closeComponentTab,
  toggleLockComponentTab,
  addComponentRefreshCallback,
  addConfirmCallback,
  clearConfirmCallback,
  addErrorCallback,
  clearErrorCallback,
  toggleScreenSize,
  // setLanguageGlobal
} = slice.actions;

export default slice.reducer;
