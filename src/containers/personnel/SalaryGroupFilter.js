import React from 'react';
import { Radio } from 'antd';
import api from '../../middleware/api';

export default class SalaryGroupFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    api.ajax({ url: api.user.getSalaryGroups() }, data => {
      this.setState({ data: data.res.salary_groups });
    });
  }

  render() {
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    return (
      <span className="mb15">
        <label className="label">薪资组</label>
        <RadioGroup
          defaultValue="0" size="large"
          onChange={this.props.filterAction.bind(this, 'salaryGroup')}
        >
          {this.state.data.map((item, index) =>
            <RadioButton value={String(index)} key={String(index)}>{item}</RadioButton>)
          }
        </RadioGroup>
      </span>
    );
  }
}
