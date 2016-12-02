import React from 'react'
import {Radio} from 'antd'
import department from '../../config/department'

export default class DepartmentFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;

    return (
      <div className="mb15">
        <label className="mr26">部门:</label>
        <RadioGroup defaultValue="0" size="large" onChange={this.props.filterAction.bind(this, 'department')}>
          <RadioButton value="0" key="0">全部</RadioButton>
          {department.map((dept) => <RadioButton value={dept.id} key={dept.id}>{dept.name}</RadioButton>)}
        </RadioGroup>
      </div>
    )
  }
}
