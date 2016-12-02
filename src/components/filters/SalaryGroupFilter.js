import React from 'react'
import {Radio} from 'antd'
import api from '../../middleware/api'

export default class SalaryGroupFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    api.ajax({url: api.user.getSalaryGroups()}, function (data) {
      this.setState({data: data.res.salary_groups});
    }.bind(this));
  }

  render() {
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    return (
      <div className="mb15">
        <label className="mr15">薪资组:</label>
        <RadioGroup defaultValue="0" size="large" onChange={this.props.filterAction.bind(this, 'salaryGroup')}>
          <RadioButton value="0" key="0">全部</RadioButton>
          {this.state.data.map((item, index) =>
            <RadioButton value={item._id} key={item._id}>{item.name}</RadioButton>)
          }
        </RadioGroup>
      </div>
    )
  }
}
