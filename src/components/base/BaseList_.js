import React from 'react';

export default class BaseList extends React.Component {
  constructor(props) {
    super(props);
    [
      'handleSuccess',
      'updatePage',
      'getList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    Number(this.props.page) === 1 ? this.getList(this.props) : this.props.actions.setPage(1);
  }

  componentWillReceiveProps(nextProps) {
    !!this.isParamsChange(this.state.paramsChange, nextProps) && this.getList(nextProps);
  }

  handleSuccess() {
    this.getList(this.props);
  }

  getList(param) {
    this.props.actions[this.state.listName](param);
  }

  updatePage(page) {
    this.props.actions.setPage(page);
  }

  isParamsChange(params, nextState) {
    for (const i in params) {
      if (params.hasOwnProperty(i)) {
        try {
          if (JSON.stringify(nextState[params[i]]) !== JSON.stringify(this.props[params[i]])) {
            return true;
          }
        } catch (e) {
          return true;
        }
      }
    }
    return false;
  }
}
