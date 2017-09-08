import { combineReducers } from 'redux';
import { transit as transitReducer } from '@databraid/transit-widget/lib/reducers';
import { github as githubReducer } from '@databraid/github-widget/lib/reducers';
import { storeReducer as slackReducer } from '@databraid/slack-widget/lib/Reducers';
// remove eslint exception when slack widget is implemented
/* eslint-disable no-unused-vars  */

import {
  TRANSIT_WIDGET_ID,
  SLACK_WIDGET_ID,
  GITHUB_WIDGET_ID,
  ADD_WIDGET,
  SHOW_ADD_WIDGET_MODAL,
  HIDE_ADD_WIDGET_MODAL,
  SHOW_DASHBOARD_SIDEBAR,
  HIDE_DASHBOARD_SIDEBAR,
} from '../constants';

const initialState = {
  ids: [],
  byId: {},
  showSidebar: false,
  showAddWidgetModal: false,
  grid: {
    nextId: 1,
    layout: [],
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  },
};

const widgets = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WIDGET:

      if (action.id === TRANSIT_WIDGET_ID && !state.ids.includes(TRANSIT_WIDGET_ID)) {
        return {
          ...state,
          ids: [...state.ids, TRANSIT_WIDGET_ID],
          showAddWidgetModal: false,
          grid: {
            ...state.grid,
            layout: [
              ...state.grid.layout,
              { i: TRANSIT_WIDGET_ID, x: 0, y: 0, w: 6, h: 8 },
            ],
          },
        };
      } else if (action.id === GITHUB_WIDGET_ID && !state.ids.includes(GITHUB_WIDGET_ID)) {
        return {
          ...state,
          ids: [...state.ids, GITHUB_WIDGET_ID],
          showAddWidgetModal: false,
          grid: {
            ...state.grid,
            layout: [
              ...state.grid.layout,
              { i: GITHUB_WIDGET_ID, x: 6, y: 0, w: 6, h: 8 },
            ],
          },
        };
      } else if (action.id === SLACK_WIDGET_ID && !state.ids.includes(SLACK_WIDGET_ID)) {
        return {
          ...state,
          ids: [...state.ids, SLACK_WIDGET_ID],
          showAddWidgetModal: false,
          grid: {
            ...state.grid,
            layout: [
              ...state.grid.layout,
              { i: SLACK_WIDGET_ID, x: 0, y: 8, w: 6, h: 6 },
            ],
          },
        };
      }
      return {
        ...state,
        showAddWidgetModal: false,
      };


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
      };

    case HIDE_DASHBOARD_SIDEBAR:
      return {
        ...state,
        showSidebar: false,
      };

    default:
      return {
        ...state,
        byId: {
          [TRANSIT_WIDGET_ID]: transitReducer(state.byId[TRANSIT_WIDGET_ID], action),
          [GITHUB_WIDGET_ID]: githubReducer(state.byId[GITHUB_WIDGET_ID], action),
          [SLACK_WIDGET_ID]: slackReducer(state.byId[SLACK_WIDGET_ID], action),
        },
        showSidebar: state.ids.length === 0,
      };
  }
};

const rootReducer = combineReducers({
  widgets,
});

export default rootReducer;
