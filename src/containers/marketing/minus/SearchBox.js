import React from 'react'
import {Input, Select, Button, Icon, message} from 'antd'
import classNames from 'classnames'
import api from '../../../middleware/api'

const Option = Select.Option;

class SearchBox extends React.Component {
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
      if (isNaN(keyType) && key.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && key.length < 3) {
        return false;
      }

      api.ajax({url: this.props.api + key}, (data) => {
        let list = data.res.list;
        if (list.length > 0) {
          this.setState({data: list});
          this.props.change({
            key: key,
            list: list
          });
        } else {
          this.setState({data: [{name: '未找到匹配客户'}]});
        }
      })
    } else {
      this.setState({data: []});
    }
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
      <div style={{display: "inline-block", verticalAlign: "top"}}>
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
              <Option key={index} value={item.phone}>{item.name} {item.phone} {item.plate_nums}</Option>
            )}
          </Select>
          <div className="ant-input-group-wrap">
            <Button
              className={btnCls}
              size="large">
              <Icon type="search"/>
            </Button>
          </div>
        </Input.Group>
      </div>
    );
  }
}

SearchBox.defaultProps = {
  placeholder: '请输入名称搜索'
};

export default SearchBox
