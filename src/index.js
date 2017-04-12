import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import Root from './containers/Root';
import configureStore from './store/configureStore';

require('./config/userstatus');

/**
 * ## States
 * defines initial state
 *
 */
import authInitialState from './reducers/auth/authInitialState';
import activityInitialState from './reducers/activity/activityInitialState';

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in App
 * @returns {Object} object with 4 keys
 */
function getInitialState() {
  const _initState = {
    auth: new authInitialState,
    activity: new activityInitialState,
  };
  return _initState;
}

const store = configureStore(getInitialState());
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history}/>,
  document.getElementById('app')
);

