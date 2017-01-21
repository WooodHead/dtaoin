import React from 'react';
import {Select} from 'antd';
import api from '../../middleware/api';

const AutoIntention = React.createClass({
  getInitialState(){
    return {
      data: [],
    };
  },
  componentDidMount() {
    const that = this;
    api.ajax({url: api.auto.getBrands()},
      (data)=> {
        that.setState({data: data.res.auto_brand_list});
      }
    );
  },

  render() {
    const Option = Select.Option;

    return (
      <span>
        <label className="mr15">品牌:</label>
          <Select
            showSearch style={{ width: 120 }} size="large"
            defaultValue="0"
            placeholder="请选择品牌"
            optionFilterProp="children"
            notFoundContent="无法找到"
            searchPlaceholder="输入关键词"
            onChange={this.props.filterAction}>
            <Option key="0">全部</Option>
            {this.state.data.map((item) => <Option key={item._id}>{item.name}</Option>)}
          </Select>
      </span>
    );
  },
});

export default AutoIntention;

