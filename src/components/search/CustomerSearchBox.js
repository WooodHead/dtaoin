import React from 'react';
import { Input, Select, Button, Icon, message } from 'antd';

import classNames from 'classnames';
import api from '../../middleware/api';

const Option = Select.Option;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      isAdd: false,
      focus: false,
      value: '',
      data: [],
    };

    [
      'handleChange',
      'handleSelect',
      'handleAdd',
      'handleFocus',
      'handleBlur',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange(key) {
    let selectValue = key;
    if (key.indexOf('-') > -1) {
      selectValue = key.split('-')[1];
    }
    this.setState({ value: selectValue });
    if (!!selectValue) {
      const keyType = Number(selectValue);
      if (isNaN(keyType) && selectValue.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && selectValue.length < 3) {
        return false;
      }

      this.setState({ isFetching: true });
      api.ajax({ url: api.customer.searchCustomer(selectValue) }, data => {
        const { list } = data.res;
        if (list.length > 0) {
          this.setState({ isFetching: false, data: list, isAdd: false });
        } else {
          this.setState({ data: [], isAdd: true });
          this.props.onChange(selectValue);
        }
      }, data => {
        this.setState({ data: [], isAdd: true });
        message.error(data);
      });
    } else {
      this.setState({ data: [] });
    }
  }

  handleSelect(value) {
    const values = value.split('-');
    this.setState({ value: values[1] });
    this.props.onSelect(values[0]);
  }

  handleAdd() {
    this.props.onAdd && this.props.onAdd();
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
  }

  render() {
    const { isAdd, value, focus, data } = this.state;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!(value && value.trim()),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': focus,
    });

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          size="large"
          mode="combobox"
          value={value}
          notFoundContent="暂无信息"
          defaultActiveFirstOption={true}
          showArrow={false}
          filterOption={false}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
        >
          {data.map(
            item => <Option key={item._id}
                            value={`${item._id  }-${  item.phone}`}>{item.name} {item.phone}</Option>,
          )}
        </Select>
        <div className="ant-input-group-wrap">
          {/* <Button className={btnCls} size="large" onClick={isAdd ? this.handleAdd : this.handleSearch}>
           <Icon type={data.length == 0 && value.length > 1 ? 'plus' : 'search'}/>
           </Button>*/}
          {
            isAdd ? <Button
              className={btnCls}
              onClick={this.handleAdd}
              size="large"
              icon="search"
            >
              <Icon type="plus" />
            </Button>
              : <Button
              className={btnCls}
              onClick={this.handleSearch}
              size="large"
              icon="search"
            >
            </Button>
          }
        </div>
      </Input.Group>
    );
  }
}

SearchBox.defaultProps = {
  placeholder: '请输入车牌号、电话搜索',
};

export default SearchBox;
