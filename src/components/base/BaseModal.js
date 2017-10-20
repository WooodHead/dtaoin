import React from 'react';

export default class BaseModalComponent extends React.Component {
  constructor(props) {
    super(props);
    [
      'showModal',
      'hideModal',
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }
}
