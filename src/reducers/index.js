import { combineReducers } from 'redux';
import { sheets as sheetsReducer } from '@databraid/sheets-widget/lib/reducers';
import { transit as transitReducer } from '@databraid/transit-widget/lib/reducers';
import { github as githubReducer } from '@databraid/github-widget/lib/reducers';
import { storeReducer as slackReducer } from '@databraid/slack-widget/lib/Reducers';
import { REHYDRATE } from 'redux-persist/constants';
import widgetConfigs from '../configurations/';
import {
  TRANSIT_WIDGET_ID,
  SLACK_WIDGET_ID,
  GITHUB_WIDGET_ID,
  SHEETS_WIDGET_ID,
  ADD_WIDGET,
  REMOVE_WIDGET,
  SHOW_ADD_WIDGET_MODAL,
  HIDE_ADD_WIDGET_MODAL,
  SHOW_DASHBOARD_SIDEBAR,
  HIDE_DASHBOARD_SIDEBAR,
  SHOW_WIDGET_SIDEBAR,
  HIDE_WIDGET_SIDEBAR,
  LOCK_DASHBOARD,
  UNLOCK_DASHBOARD,
  SAVE_LAYOUT_CHANGE,
} from '../constants';

const initialState = {
  ids: [],
  byId: {},
  showSidebar: false,
  showAddWidgetModal: false,
  locked: false,
  grid: {
    nextId: 1,
    layout: [],
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  },
  metadata: {},
};

export const collapseWidgetSidebars = (metadata) => {
  const newMetadata = { ...metadata };
  Object.keys(newMetadata).forEach((widgetId) => {
    newMetadata[widgetId] = {
      ...metadata[widgetId],
      showSidebar: false,
    };
  });
  return newMetadata;
};


export const getWidgetConfigByType = (type) => {
  if (!type) {
    return undefined;
  }
  const configurations = widgetConfigs.filter(cfg => cfg.type === type);
  if (configurations.length === 0) {
    throw new Error(`Invalid widget type in configurations file - type [${type}] does not exist`);
  }
  if (configurations.length > 1) {
    throw new Error(`Invalid widget type in configurations file - multiple entries of type [${type}]`);
  }
  return configurations[0];
};


export const widgets = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WIDGET: {
      const widgetConfig = getWidgetConfigByType(action.id);
      return {
        ...state,
        ids: [...state.ids, widgetConfig.type],
        showAddWidgetModal: false,
        grid: {
          ...state.grid,
          layout: [
            ...state.grid.layout,
            {
              i: widgetConfig.type,
              x: 0,
              y: 0,
              w: widgetConfig.initWidth,
              h: widgetConfig.initHeight,
              minW: widgetConfig.minWidth,
              minH: widgetConfig.minHeight,
              static: false,
            },
          ],
        },
        metadata: {
          ...state.metadata,
          [action.id]: {
            type: widgetConfig.type,
            showSidebar: false,
          },
        },
      };
    }

    case REMOVE_WIDGET: {
      const newIds = [...state.ids];
      const removeIndex = newIds.indexOf(action.id);

      if (removeIndex > -1) {
        newIds.splice(removeIndex, 1);
      }

      return {
        ...state,
        ids: newIds,
      };
    }

    case SHOW_ADD_WIDGET_MODAL:
      return {
        ...state,
        showAddWidgetModal: true,
        showSidebar: false,
      };

    case HIDE_ADD_WIDGET_MODAL:
      return {
        ...state,
        showAddWidgetModal: false,
      };

    case SHOW_DASHBOARD_SIDEBAR:
      return {
        ...state,
        showSidebar: true,
        metadata: collapseWidgetSidebars(state.metadata),
      };

    case HIDE_DASHBOARD_SIDEBAR:
      return {
        ...state,
        showSidebar: false,
      };

    case REHYDRATE:
      /* You can also only pass in what you want to persist in the store by
      accessing the path you want to persist from the action.payload. */
      return {
        ...state,
        ...action.payload.widgets,
      };

    case SHOW_WIDGET_SIDEBAR:
      return {
        ...state,
        metadata: {
          ...collapseWidgetSidebars(state.metadata),
          [action.id]: {
            ...state.metadata[action.id],
            showSidebar: true,
          },
        },
        showSidebar: false,
      };

    case HIDE_WIDGET_SIDEBAR:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          [action.id]: {
            ...state.metadata[action.id],
            showSidebar: false,
          },
        },
      };

    case LOCK_DASHBOARD:
      return {
        ...state,
        showSidebar: false,
        locked: true,
        grid: {
          ...state.grid,
          layout: state.grid.layout.map(layoutObj => (
            {
              ...layoutObj,
              static: true,
            }
          )),
        },
      };

    case UNLOCK_DASHBOARD:
      return {
        ...state,
        showSidebar: false,
        locked: false,
        grid: {
          ...state.grid,
          layout: state.grid.layout.map(layoutObj => (
            {
              ...layoutObj,
              static: false,
            }
          )),
        },
      };

    case SAVE_LAYOUT_CHANGE:
      return {
        ...state,
        grid: {
          ...state.grid,
          layout: action.layout,
        },
      };

    default:
      return {
        ...state,
        byId: {
          [TRANSIT_WIDGET_ID]: transitReducer(state.byId[TRANSIT_WIDGET_ID], action),
          [GITHUB_WIDGET_ID]: githubReducer(state.byId[GITHUB_WIDGET_ID], action),
          [SLACK_WIDGET_ID]: slackReducer(state.byId[SLACK_WIDGET_ID], action),
          [SHEETS_WIDGET_ID]: sheetsReducer(state.byId[SHEETS_WIDGET_ID], action),
        },
        showSidebar: state.ids.length === 0,
      };
  }
};

const rootReducer = combineReducers({
  widgets,
});

export default rootReducer;
