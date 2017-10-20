import React, { Component } from 'react';
import { Input, Select, Icon, message } from 'antd';
import classNames from 'classnames';
const Option = Select.Option;

import PropTypes from 'prop-types';
// 属性类型
const propTypes = {
  placeholder: PropTypes.string,          // 关键词输入的占位符
  defaultKey: PropTypes.string,           // 默认的搜索关键词
  keyValidator: PropTypes.func,           // 搜索关键词的验证
  validateFailMsg: PropTypes.string,      // 验证未通过时的报错信息
  displayPattern: PropTypes.func,         // 显示数据生成函数
  onSearch: PropTypes.func.isRequired,    // 当进行搜索时, 在对请求的数据进行处理后, 请务必执行回调设置data数据
  autoSearchLength: PropTypes.number,     // 自动搜索长度
  onSelectItem: PropTypes.func, // 当选中一个项目时, 这里会传入一个包装好的对象: {xxx: 'xxx'}
  onSelectKey: PropTypes.func,
  dataEmpty: PropTypes.bool,
};

// 默认属性
const defaultProps = {
  placeholder: '请输入关键词',
  defaultKey: '',
  keyValidator: null,
  validateFailMsg: '输入验证未通过！',
  displayPattern: item => item.name || item.id || '',
  onSearch: (key, callback) => {
    callback([]);
  },
  autoSearchLength: 0,        // 默认自动搜索
  onSelectItem: () => {
  },
  onSelectKey: () => {

  },
  dataEmpty: true,
  disabled: false,
  searchDisabled: false,
  style: { width: '300px' },
  // onSelectItem: (selectInfo) => {},
};

// 组件
class SearchSelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.defaultKey || '',    // 搜索关键词
      data: [],                       // 搜索结果
      selectedIndex: '',              // 选中项的下标
      focus: false,                   // 焦点
      searching: false,               // 搜索状态
    };
    this.optionPerfix = 'option_';
    // 自动绑定
    [
      'onKeyChange',
      'handleFocus',
      'handleBlur',
      'onSearch',
      '_onSearchSuccess',
      '_onSearchFail',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataEmpty) {
      this.setState({
        data: [],
        key: '',
        selectedIndex: '',
      });
    }
  }

  componentDidMount() {
    if (this.state.key.length >= this.props.autoSearchLength) {
      this.props.onSearch(this.state.key, this._onSearchSuccess, this._onSearchFail);
    }
  }

  _onSearchSuccess(data = []) {
    if (!this.state.hasMove && !!this.props.defaultIndex) {
      this.setState({
        data,
        selectedIndex: '0',
        searching: false,
        hasMove: true,
      });
    } else {
      this.setState({
        data,
        selectedIndex: '',
        searching: false,
      });
    }
  }

  _onSearchFail(error) {
    message.error(error);
    this.setState({
      data: [],
      selectedIndex: '',
      searching: false,
    });
  }

  search(key) {
    key = key.trim();
    const keyValidator = this.props.keyValidator;
    if (typeof(keyValidator) == 'function' && !keyValidator(key)) {
      this.setState({
        key,
        selectedIndex: '',
      });
      message.error(this.props.validateFailMsg);
    } else {
      this.setState({
        key,
        selectedIndex: '',
        searching: true,
      });
      this.props.onSearch(key, this._onSearchSuccess, this._onSearchFail);
    }
  }

  onKeyChange(newKey) {
    // 判断是输入变化，还是选择变化
    if (newKey.indexOf(this.optionPerfix) == -1) {
      // 输入变化
      // 是否自动搜索
      if (newKey.length >= this.props.autoSearchLength) {
        this.search(newKey);
      } else if (newKey.length == 0) {
        this.search('');
        this.setState({
          key: newKey,
          data: [],
          selectedIndex: '',
        });
      } else {
        this.setState({
          key: newKey,
          data: [],
          selectedIndex: '',
        });
      }
    } else {
      // 选择变化
      const data = this.state.data;
      const selectedIndex = newKey.substr(7);
      const selectedItem = data[selectedIndex];
      this.setState({
        selectedIndex,
      });
      this.props.onSelectItem(selectedItem);
      this.props.onSelectKey(selectedIndex);
    }
  }

  handleFocus() {
    this.setState({ focus: true });
  }

  handleBlur() {
    this.setState({ focus: false });
  }

  onSearch() {
    this.search(this.state.key);
  }

  render() {
    const { placeholder, displayPattern } = this.props;
    const { key, data, selectedIndex, searching, focus } = this.state;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!key.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': focus,
    });

    const displayValue = selectedIndex === '' ? key : (data.length > 0) ? data[selectedIndex].name ||
      data[selectedIndex].customer_name || data[selectedIndex].company_name : '';

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          mode="combobox"
          value={displayValue}
          size="large"
          notFoundContent="暂无信息"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.onKeyChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          disabled={this.props.searchDisabled}
          placeholder={placeholder}
        >
          {data.map((item, index) =>
            <Option key={`option_${  index}`}>{displayPattern(item)}</Option>,
          )}
        </Select>
        <div className="ant-input-group-wrap">
          <Icon type="search" style={{ position: 'relative', right: '10px', top: '8px' }} />
        </div>
      </Input.Group>
    );
  }
}

SearchSelectBox.propTypes = propTypes;
SearchSelectBox.defaultProps = defaultProps;

export default SearchSelectBox;

// usage 用法示例
/*
 import React, {Component} from 'react'

 import api from '../../../middleware/api'
 import validator from '../../../middleware/validator'
 import SearchSelectBox from './SearchSelectBox'


 export default class SearchSelectBoxTest extends Component {
 render() {

 let keyValidator = function (key) {
 return validator.number(key);
 };

 let displayPattern = function (item) {
 return `${item.customer_name} ${item.customer_phone} ${item.plate_num}`;
 // return item.name
 };

 let onSearch = function (key, successHandle, failHandle) {
 let url = api.aftersales.searchMaintainCustomerList() + key;
 api.ajax({url}, (data) => {
 if (data.code === 0) {
 successHandle(data.res.list);
 } else {
 failHandle(data.msg);
 }
 }, (error) => {
 failHandle(error);
 })
 };

 let onSelectItem = function (selectInfo) {
 };


 return (
 <SearchSelectBox
 style={{width: 250}}
 placeholder={'请输入手机号'}
 defaultKey={'hahaha'}
 keyValidator={keyValidator}
 displayPattern={displayPattern}
 onSearch={onSearch}
 autoSearchLength={3}
 onSelectItem={onSelectItem}
 />
 );
 }
 }
 */
