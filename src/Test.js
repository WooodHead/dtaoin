import React, { Component } from 'react';

export default class ClassName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 0,
      b: 0,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
  }

  render() {
    const { a, b } = this.state;
    console.log('a', a);
    console.log('b', b);
    return (
      <div>
        此页为测试页面。
        <button onClick={this.handleButtonClick}>点击</button>
        <h2>a+1={a}</h2>
        <h2>b+5={b}</h2>
      </div>
    );
  }
}
