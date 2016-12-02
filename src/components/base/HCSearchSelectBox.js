import React, {Component, PropTypes} from 'react'
import {Input, Select, Button, Icon, message} from 'antd'
import classNames from 'classnames'
const Option = Select.Option;

//属性类型
const propTypes = {
  placeholder: PropTypes.string,          //关键词输入的占位符
  defaultKey: PropTypes.string,           //默认的搜索关键词
  keyValidator: PropTypes.func,           //搜索关键词的验证
  validateFailMsg: PropTypes.string,      //验证未通过时的报错信息
  displayPattern: PropTypes.func,         //显示数据生成函数
  onSearch: PropTypes.func.isRequired,    //当进行搜索时, 在对请求的数据进行处理后, 请务必执行回调设置data数据
  autoSearch: PropTypes.bool,             //是否自动搜索
  onSelectItem: PropTypes.func,           //当选中一个项目时, 这里会传入一个包装好的对象: {xxx: 'xxx'}
};

//默认属性
const defaultProps = {
  placeholder: '请输入关键词',
  defaultKey: '',
  keyValidator: null,
  validateFailMsg: '输入验证未通过！',
  displayPattern: (item) => {
    return item.name || item.id || ''
  },
  onSearch: (key, callback) => {
    callback([])
  },
  autoSearch: false,
  onSelectItem: (selectInfo) => {
  },
};


//组件
class HCSearchSelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.defaultKey || '',    //搜索关键词
      data: [],                       //搜索结果
      selectedIndex: '',              //选中项的下标
      focus: false,                   //焦点
      searching: false,               //搜索状态
    };
    this.optionPerfix = 'option_';
    //自动绑定
    [
      'onKeyChange',
      'onFocusOrBlur',
      'onSearch',
      '_onSearchSuccess',
      '_onSearchFail',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  _onSearchSuccess(data = []) {
    this.setState({
      data: data,
      selectedIndex: '',
      searching: false,
    });
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
    let keyValidator = this.props.keyValidator;
    if (typeof(keyValidator) == 'function' && !keyValidator(key)) {
      this.setState({
        key: key,
        selectedIndex: '',
      });
      message.error(this.props.validateFailMsg);
    } else {
      this.setState({
        key: key,
        selectedIndex: '',
        searching: true,
      });
      this.props.onSearch(key, this._onSearchSuccess, this._onSearchFail);
    }
  }

  onKeyChange(newKey) {
    //判断是输入变化，还是选择变化
    if (newKey.indexOf(this.optionPerfix) == -1) {
      //输入变化
      //是否自动搜索
      if (this.props.autoSearch) {
        this.search(newKey);
      } else {
        this.setState({
          key: newKey,
          data: [],
          selectedIndex: '',
        });
      }
    } else {
      //选择变化
      const data = this.state.data;
      const selectedIndex = newKey.substr(7);
      const selectedItem = data[selectedIndex];
      this.setState({
        selectedIndex: selectedIndex,
      });
      this.props.onSelectItem(selectedItem);
    }

  }

  onFocusOrBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  }

  onSearch() {
    this.search(this.state.key);
  }

  render() {
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.key.trim()
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus
    });

    const {placeholder, displayPattern} = this.props;
    const {key, data, selectedIndex, searching} = this.state;

    const displayValue = selectedIndex === '' ? key : displayPattern(data[selectedIndex]);

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          size="large"
          combobox
          value={displayValue}
          placeholder={placeholder}
          notFoundContent="暂无信息"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.onKeyChange}
          onFocus={this.onFocusOrBlur}
          onBlur={this.onFocusOrBlur}>
          {data.map((item, index) =>
            <Option key={index} value={'option_' + index}>{displayPattern(item)}</Option>
          )}
        </Select>
        <div className="ant-input-group-wrap">
          <Button
            style={{minWidth: 28}}
            icon="search"
            className={btnCls}
            size="large"
            loading={searching}
            onClick={this.onSearch}
          />
        </div>
      </Input.Group>
    );
  }
}

HCSearchSelectBox.propTypes = propTypes;
HCSearchSelectBox.defaultProps = defaultProps;

export default HCSearchSelectBox


// usage 用法示例
/*
import React, {Component} from 'react'

import api from '../../../middleware/api'
import validator from '../../../middleware/validator'
import HCSearchSelectBox from './HCSearchSelectBox'


export default class HCSearchSelectBoxTest extends Component {
  render() {

    let keyValidator = function (key) {
      return validator.number(key);
    };

    let displayPattern = function (item) {
      return `${item.customer_name} ${item.customer_phone} ${item.plate_num}`;
      // return item.name
    };

    let onSearch = function (key, successHandle, failHandle) {
      let url = api.searchMaintainCustomerList() + key;
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
      console.log('selectInfo--------\n', JSON.stringify(selectInfo));
    };


    return (
      <HCSearchSelectBox
        style={{width: 250}}
        placeholder={'请输入手机号'}
        defaultKey={'hahaha'}
        keyValidator={keyValidator}
        displayPattern={displayPattern}
        onSearch={onSearch}
        autoSearch={false}
        onSelectItem={onSelectItem}
      />
    );
  }
}
*/