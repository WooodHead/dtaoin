import React from 'react'
import {Radio} from 'antd'
import api from '../../middleware/api'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const AutoCustomer = React.createClass({
  getInitialState(){
    return {
      data: [],
    }
  },
  componentDidMount() {
    const that = this;
    api.ajax({url: api.customer.getSourceTypes(this.props.customerType)},
      function (data) {
        that.setState({data: data.res.source_types});
      })
  },
  render (){
    return (
      <div className="mb15">
        <label className="mr15">客户来源:</label>
        <RadioGroup defaultValue="0" size="large" onChange={this.props.filterAction}>
          <RadioButton value="0">全部</RadioButton>
          {this.state.data.map((item, index) => <RadioButton value={item.id} key={item.id}>{item.desc}</RadioButton>)}
        </RadioGroup>
      </div>
    )
  },
})
export default AutoCustomer

