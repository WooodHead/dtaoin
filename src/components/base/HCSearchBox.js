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
  onSearch: PropTypes.func.isRequired,    //当进行搜索时
  autoSearch: PropTypes.bool,             //是否自动搜索
};

//默认属性
const defaultProps = {
  placeholder: '请输入关键词',
  defaultKey: '',
  keyValidator: null,
  validateFailMsg: '输入验证未通过！',
  onSearch: (key, callback) => {
    callback([])
  },
  autoSearch: false,
};


//组件
class HCSearchBox extends Component {
  constructor(props) {
    super(props);
    //状态
    this.state = {
      key: props.defaultKey || '',    //搜索关键词
      searching: false,               //搜索状态
    };
    //自动绑定
    [
      'onKeyChange',
      'onFocusOrBlur',
      'onSearch',
      '_onSearchSuccess',
      '_onSearchFail',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  _onSearchSuccess() {
    this.setState({
      searching: false,
    });
  }

  _onSearchFail(error) {
    message.error(error);
    this.setState({
      searching: false,
    });
  }

  search(key) {
    key = key.trim();
    let keyValidator = this.props.keyValidator;
    if (typeof(keyValidator) == 'function' && !keyValidator(key)) {
      this.setState({
        key: key,
      });
      message.error(this.props.validateFailMsg);
    } else {
      this.setState({
        key: key,
        searching: true,
      });
      this.props.onSearch(key, this._onSearchSuccess, this._onSearchFail);
    }
  }

  onKeyChange(e) {
    //输入变化
    //是否自动搜索
    const newKey = e.target.value;
    if (this.props.autoSearch) {
      this.search(newKey);
    } else {
      this.setState({
        key: newKey,
      });
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

    const {placeholder} = this.props;
    const {key, searching} = this.state;

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Input
          size="large"
          placeholder={placeholder}
          value={key}
          onChange={this.onKeyChange}
          onFocus={this.onFocusOrBlur}
          onBlur={this.onFocusOrBlur}
          onPressEnter={this.handleSearch}
        />
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

HCSearchBox.propTypes = propTypes;
HCSearchBox.defaultProps = defaultProps;

export default HCSearchBox



// usage 用法示例
/*
import React, {Component} from 'react'

import api from '../../../middleware/api'
import validator from '../../../middleware/validator'
import HCSearchBox from './HCSearchBox'


export default class HCComponentTest extends Component {
  render() {

    let keyValidator = function (key) {
      return validator.number(key);
    };

    let onSearch = function (key, successHandle, failHandle) {
      let url = api.searchMaintainCustomerList() + key;
      api.ajax({url}, (data) => {
        if (data.code === 0) {
          console.log('data.res.list--------', JSON.stringify(data.res.list));
          successHandle();
        } else {
          failHandle(data.msg);
        }
      }, (error) => {
        failHandle(error);
      })
    };

    return (
      <HCSearchBox
        style={{width: 250}}
        placeholder={'请输入手机号'}
        defaultKey={'hahaha'}
        keyValidator={keyValidator}
        validateFailMsg={"请输入手机号查询"}
        onSearch={onSearch}
        autoSearch={true}
      />
    );
  }
}

*/
