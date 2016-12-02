import React, {Component} from 'react'
import {Tag} from 'antd';

export default class StopUse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stop_oruse: "停用",
    }
  }


  render() {
    let {stop_oruse} = this.state;
    return (
      <div>
        <p style={{color: "#2db7f5", cursor: "pointer"}}>{stop_oruse}</p>
      </div>
    )
  }
}
