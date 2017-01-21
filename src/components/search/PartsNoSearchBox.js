import React from 'react';
import {Input, Select, Button, Icon} from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';
import validator from '../../utils/validator';

const Option = Select.Option;

class PartsNoSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
      focus: false,
    };
    [
      'handleChange',
      'handleSelect',
      'searchCustomersByKey',
      'handleFocus',
      'handleBlur',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  handleChange(key) {
    this.setState({value: key});
    if (key) {
      let keyType = Number(key);

      if (validator.pattern.enString.test(key)) {
        return;
      }
      if (isNaN(keyType) && key.length < 2) {
        this.setState({data: []});
        return;
      }
      if (!isNaN(keyType) && key.length < 2) {
        this.setState({data: []});
        return;
      }

      this.searchCustomersByKey(key);
    } else {
      this.props.change({key: key});
    }
  }

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.data;

    this.setState({value: list[index].name + ' ' + list[index].part_no});

    this.searchCustomersByKey('id:' + list[index]._id);
  }

  searchCustomersByKey(key) {
    api.ajax({url: this.props.api(key)}, (data) => {
      let list = data.res.list;
      if (list.length > 0) {
        this.setState({data: list});
        this.props.change({
          key: key,
          list: list,
        });
      } else {
        this.setState({data: [{name: '未找到配件', part_no: ''}]});
      }
    });
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
      'ant-search-btn-noempty': !!this.state.value.trim(),
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
          onSearch={this.handleChange}
          onSelect={this.handleSelect}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {this.state.data.map((item, index) =>
            <Option key={index} vlaue={item._id}>{item.name} {item.part_no}</Option>)
          }
        </Select>
        <div className="ant-input-group-wrap">
          <Button className={btnCls} size="large"><Icon type="search"/></Button>
        </div>
      </Input.Group>
    );
  }
}

PartsNoSearchBox.defaultProps = {
  placeholder: '请输入配件号或配件名搜索',
};

export default PartsNoSearchBox;
