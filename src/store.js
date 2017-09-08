import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import TRANSIT_API from '@databraid/transit-widget/lib/utils/Api';
import GITHUB_API from '@databraid/github-widget/lib/utils/Api';
import SLACK_API from '@databraid/slack-widget/lib/Utils/Api';
import rootReducer from './reducers';

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware.withExtraArgument({ TRANSIT_API, GITHUB_API, SLACK_API })),
  // applyMiddleware(...middleware),
);

export default store;
