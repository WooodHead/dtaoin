import React from 'react';
import { Input, Select, Icon } from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';

import NewCustomerAutoModal from '../../containers/auto/NewCustomerAutoModal';

const Option = Select.Option;

class CustomerAutoSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
      focus: false,
    };
    [
      'handleOnSuccess',
      'handleSearch',
      'handleSelect',
      'handleFocus',
      'handleBlur',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  handleOnSuccess(data) {
    this.setState({ value: data.customer_phone, data: [data] });
    this.props.select(data);
  }

  handleSelect(value, option) {
    const index = option.props.index;
    const list = this.state.data;
    this.setState({ value: option.props.children });
    this.props.select(list[index]);
  }

  handleSearch(key) {
    this.setState({ value: key });
    if (!!key) {
      const keyType = Number(key);
      if (isNaN(keyType) && key.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && key.length < 6) {
        return false;
      }

      api.ajax({ url: api.presales.searchCustomerAutos(key) }, data => {
        let list = data.res.list;
        if (list.length > 0) {
          list = list.filter(item => item._id != null);
          this.setState({ data: list });
        } else {
          this.setState({ data: [] });
        }
      });
    }
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
  }

  render() {
    const { focus, value, data } = this.state;

    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': focus,
    });

    // 新增意向中当搜索不到用户时候不显示添加用户,这里只有新增意向中会传递create属性
    const { create } = this.props;

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <div id="customer_auto_search">
          <Select
            mode="combobox"
            value={this.state.value}
            defaultActiveFirstOption={false}
            notFoundContent="暂无结果"
            getPopupContainer={() => document.getElementById('customer_auto_search')}
            optionLabelProp="children"
            showArrow={false}
            filterOption={false}
            onSelect={this.handleSelect}
            onSearch={this.handleSearch}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            dropdownStyle={{ maxHeight: '110px' }}
            placeholder={this.props.placeholder}
            size="large"
          >
            {data.map(item =>
              <Option key={`${item._id  }`}>
                {item.customer_name} {item.customer_phone} {item.plate_num}
              </Option>)
            }
          </Select>
        </div>

        <div className="ant-input-group-wrap">
          {
            value.length > 0 && data.length == 0 && !create
              ?
              <NewCustomerAutoModal
                inputValue={value}
                onSuccess={this.handleOnSuccess}
                size="default"
                required={true}
              />
              :
              <span style={{ position: 'relative', left: '-10px', top: '4px' }}>
                <Icon type="search"/>
              </span>
          }
        </div>
      </Input.Group>
    );
  }
}

CustomerAutoSearchBox.defaultProps = {
  placeholder: '请输入手机号、车牌号选择或创建用户',
};

export default CustomerAutoSearchBox;
