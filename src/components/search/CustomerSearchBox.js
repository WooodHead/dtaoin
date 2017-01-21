import React from 'react';
import {Input, Select, Button, Icon} from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';

const Option = Select.Option;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
      focus: false,
    };
    [
      'handleChange',
      'handleFocus',
      'handleBlur',
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
            list: list,
          });
        } else {
          this.setState({data: [{name: '未找到匹配客户'}]});
        }
      });
    } else {
      this.setState({data: []});
    }
  }

  handleFocus() {
    this.setState({focus: true});
  }

  handleBlur() {
    this.setState({focus: false});
  }

  render() {
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!(this.state.value && this.state.value.trim()),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
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
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}>
          {
            this.state.data.map((item, index) =>
              <Option key={index} value={item.phone || item.customer_phone || ''}>
                {item.name || item.customer_name} {item.phone || item.customer_phone} {item.plate_nums || item.plate_num}
              </Option>
            )
          }
        </Select>
        <div className="ant-input-group-wrap">
          <Button
            className={btnCls}
            size="large">
            <Icon type="search"/>
          </Button>
        </div>
      </Input.Group>
    );
  }
}

SearchBox.defaultProps = {
  placeholder: '请输入车牌号、姓名或电话搜索',
};

export default SearchBox;
