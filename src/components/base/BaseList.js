import React from 'react'

export default class BaseList extends React.Component {
  constructor(props) {
    super(props);
    [
      'handleConditionChange',
      'handleDateChange',
      'handleRadioChange',
      'updateState'
    ].map(method => this[method] = this[method].bind(this));
  }

  updateState(obj) {
    this.setState(obj);
  }

  /* 3 types:
   * value:=value,InputNumber,etc
   * checkbox: =event.state.checked
   * other form element: =event.state.value
   */
  handleConditionChange(type, name, event) {
    if (type === 'value') {
      this.setState({[name]: event});
    } else {
      this.setState({[name]: name == "checkbox" ? event.state.checked : event.target.value});
    }
  }

  handleDateChange(propName, value, mString) {
    this.setState({[propName]: mString})
  }

  handleRadioChange(propName, e) {
    this.setState({[propName]: e.target.value})
  }
}
