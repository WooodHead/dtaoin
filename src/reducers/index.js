import {routerReducer as routing} from 'react-router-redux';
import {combineReducers} from 'redux';

import auth from './auth/authReducer';
import activity from './activity/activityReducer';

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
  routing,

  auth,
  activity,
});

export default rootReducer;
