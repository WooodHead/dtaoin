import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import api from '../middleware/api';

const auth = path => {
  if (!api.isSuperAdministrator() && !api.isChainAdministrator() && !api.isHeadquarters() &&
    !api.isStoreGeneralManager()) {
    return processAuth(path);
  } else {
    try {
      _czc.push(['_trackEvent', api.getLoginUser().companyName, path]);
    } catch (e) {
    }
    return true;
  }
};

const processAuth = path => {
  const pathAuth = assemblePath(path);

  if (!pathAuth) {
    try {
      _czc.push(['_trackEvent', api.getLoginUser().companyName, path]);
    } catch (e) {
    }
    return true;
  }

  if (Number(['home', 'permission-403', 'permission-404'].indexOf(pathAuth)) > -1) {
    try {
      _czc.push(['_trackEvent', api.getLoginUser().companyName, path]);
    } catch (e) {
    }
    return true;
  }

  return authorization(pathAuth, path);
};

const authorization = (pathAuth, path) => {
  const userPermissions = JSON.parse(api.getUserPermissions());
  const hasPermission = userPermissions.find(permission => permission.item_path === pathAuth);
  if (!!hasPermission) {
    try {
      _czc.push(['_trackEvent', api.getLoginUser().companyName, path]);
    } catch (e) {
    }
  }
  return !!hasPermission;
};

const assemblePath = path => {
  if (!!path) {
    if (path.indexOf(':') > -1) {
      path = path.substring(0, path.indexOf(':'));
    }

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    if (path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    return path;
  } else {
    return '/home';
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
      api.isLogin() ? auth(props.match.path) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/permission-403',
          state: { from: props.location },
        }} />
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location },
        }} />
      )
    )} />
);

export default PrivateRoute;
