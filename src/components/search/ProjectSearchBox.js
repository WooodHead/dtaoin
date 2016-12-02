import React from 'react'
import {Input, Select, Button, Icon, message} from 'antd'
import classNames from 'classnames'
import api from '../../middleware/api'
import validator from '../../middleware/validator'

const Option = Select.Option;

class ProjectSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
      focus: false
    };
    [
      'handleChange',
      'handleFocusBlur'
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  handleChange(key) {
    this.setState({value: key});
    if (!!key) {
      let keyType = Number(key);

      if (validator.pattern.enString.test(key)) {
        return false;
      }
      if (isNaN(keyType) && key.length < 2) {
        return false;
      }
      if (!isNaN(keyType) && key.length < 3) {
        return false;
      }

      this.searchCustomersByKey(key);
    } else {
      this.setState({data: []});
    }
  }

  searchCustomersByKey(key) {
    api.ajax({url: this.props.api + key}, (data)=> {
      let list = data.res.list;
      if (list.length > 0) {
        this.setState({data: list});
        this.props.change({
          list: list,
          key: key
        });
      } else {
        this.setState({data: [{name: '未找到匹配的工单'}]});
      }
    })
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  }

  render() {
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim()
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus
    });

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          size="large"
          combobox
          value={this.state.value}
          placeholder={this.props.placeholder}
          notFoundContent="暂无信息"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.handleChange}
          onFocus={this.handleFocusBlur}
          onBlur={this.handleFocusBlur}>
          {this.state.data.map((item, index) =>
            <Option key={index} value={item.customer_phone}>{item.customer_name} {item.customer_phone}</Option>)
          }
        </Select>
        <div className="ant-input-group-wrap">
          <Button className={btnCls} size="large"><Icon type="search"/></Button>
        </div>
      </Input.Group>
    );
  }
}

ProjectSearchBox.defaultProps = {
  placeholder: '请输入车牌号、姓名或电话搜索'
};

export default ProjectSearchBox
