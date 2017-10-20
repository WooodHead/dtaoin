import React from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import App from './App';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../containers/Login';
import PropTypes from 'prop-types';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={App} />
        </Switch>
        <DevTools />
      </div>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
