import React, {Component} from 'react';

let image = require('../../../images/commingsoon.png');

export default class Detail extends Component {
  render() {
    return (
      <div className="mb20 center">
        <img src={image}/>
      </div>
    );
  }
}

