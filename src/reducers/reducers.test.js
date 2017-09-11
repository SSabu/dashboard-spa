import { Reducer } from 'redux-testkit';
import { transit as transitReducer } from '@databraid/transit-widget/lib/reducers';
import { github as githubReducer } from '@databraid/github-widget/lib/reducers';
import { storeReducer as slackReducer } from '@databraid/slack-widget/lib/Reducers';
import { widgets as rootReducer } from './index';
import {
  TRANSIT_WIDGET_ID,
  SLACK_WIDGET_ID,
  GITHUB_WIDGET_ID,
} from '../constants';

const initialState = {
  ids: [],
  byId: {},
  showSidebar: true,
  showAddWidgetModal: false,
  grid: {
    nextId: 1,
    layout: [],
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  },
};

describe('rootReducer', () => {
  it('should have initial state', () => {
    expect(rootReducer(initialState, {}))
      .toEqual({
        ...initialState,
        byId: {
          [TRANSIT_WIDGET_ID]: transitReducer(undefined, {}),
          [GITHUB_WIDGET_ID]: githubReducer(undefined, {}),
          [SLACK_WIDGET_ID]: slackReducer(undefined, {}),
        },
      });
  });

  it('should not affect state', () => {
    Reducer(rootReducer)
      .withState(initialState)
      .expect({ type: 'NOT_EXISTING' })
      .toReturnState({
        ...initialState,
        byId: {
          [TRANSIT_WIDGET_ID]: transitReducer(undefined, {}),
          [GITHUB_WIDGET_ID]: githubReducer(undefined, {}),
          [SLACK_WIDGET_ID]: slackReducer(undefined, {}),
        },
      });
  });

  it('should add a widget to the dashboard', () => {
    const action = { type: 'ADD_WIDGET', id: 'transit' };
    Reducer(rootReducer).withState(initialState).expect(action).toReturnState({
      ...initialState,
      ids: ['transit'],
      showAddWidgetModal: false,
      grid: {
        ...initialState.grid,
        layout: [
          ...initialState.grid.layout,
          { i: TRANSIT_WIDGET_ID, x: 0, y: 0, w: 6, h: 8 },
        ],
      },
    });
  });

  it('should show modal to add widget', () => {
    const action = { type: 'SHOW_ADD_WIDGET_MODAL' };
    Reducer(rootReducer).withState(initialState).expect(action).toReturnState({
      ...initialState,
      showAddWidgetModal: true,
      showSidebar: false,
    });
  });

  it('should hide add widget modal', () => {
    const action = { type: 'HIDE_ADD_WIDGET_MODAL' };
    Reducer(rootReducer).withState(initialState).expect(action).toReturnState({
      ...initialState,
      showAddWidgetModal: false,
    });
  });

  it('should show dashboard sidebar', () => {
    const action = { type: 'SHOW_DASHBOARD_SIDEBAR' };
    Reducer(rootReducer).withState(initialState).expect(action).toReturnState({
      ...initialState,
      showSidebar: true,
    });
  });

  it('should hide dashboard sidebar', () => {
    const action = { type: 'HIDE_DASHBOARD_SIDEBAR' };
    Reducer(rootReducer).withState(initialState).expect(action).toReturnState({
      ...initialState,
      showSidebar: false,
    });
  });
});
