import React, { Component } from 'react';

import formatter from '../../../utils/DateFormatter';

import DateWeek from './DateWeek';
import Situation from './Situation';

let now = new Date();
// if (String(now.getDay()) === '1') {
now = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - 7));
// }

export default class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 -
        (now.getDay() || 7))),
    };

    [
      'handleWeekChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleWeekChange(startTime) {
    this.setState({ startTime });
  }

  render() {
    const { startTime } = this.state;

    return (
      <div>
        <DateWeek onWeekChange={this.handleWeekChange} />
        <Situation startTime={startTime} />
      </div>
    );
  }
}
