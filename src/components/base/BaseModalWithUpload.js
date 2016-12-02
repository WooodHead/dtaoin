import React from 'react'
import {Modal, Button, Icon} from 'antd'
import BaseUpload from './BaseUpload';

export default class BaseModalWithUpload extends BaseUpload {
  constructor(props) {
    super(props);
    [
      'showModal',
      'hideModal'
    ].map(method => this[method] = this[method].bind(this));
  }

  showModal() {
    this.setState({visible: true});
  }

  hideModal() {
    this.setState({visible: false});
  }
}
