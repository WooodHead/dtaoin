import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../containers/Login';
import PropTypes from 'prop-types';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
