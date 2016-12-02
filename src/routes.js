import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'

// 启用redux后,使用该router
export default (
  <Route path="/" component={App}>
    <Route path="/app" component={App} />
  </Route>
)
