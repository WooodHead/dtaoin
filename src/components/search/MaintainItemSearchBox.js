import React from 'react';
import { Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';
import NewItem from '../../containers/maintain-item/EditNew';
import createReactClass from 'create-react-class';

const Option = Select.Option;

const MaintainItemSearchBox = createReactClass({
  getInitialState() {
    return {
      data: this.props.data ? this.props.data : [],
      value: this.props.value ? this.props.value : '',
      focus: false,
      style: this.props.style,
    };
  },

  handleOnSuccess(data) {
    this.setState({ value: data.name, data: [data] });
    this.setState({ style: { width: '100%' } });
    this.props.select(data);
  },

  handleSelect(value, option) {
    const index = option.props.index;
    const list = this.state.data;
    this.setState({ value: option.props.children });

    this.props.select(list[index]);
  },

  handleChange(key) {
    this.setState({ value: key });

    if (key.length < 2) {
      this.setState({ style: { width: '100%' } });
    }

    if (!!key && key.length >= 2) {
      api.ajax({ url: api.maintainItem.list({ key }) }, data => {
        const list = data.res.list;

        // 搜索框的长度要根据搜出来的结果变化
        if (key.length > 1 && list.length == 0) {
          this.setState({ style: { width: '110px' } });
        } else {
          this.setState({ style: { width: '100%' } });
        }

        if (list.length > 0) {
          this.setState({ data: list });
        } else {
          this.setState({ data: [] });
        }
      });
    } else {
      if (key.length > 1) {
        this.setState({ style: { width: '150px' } });
      }
      this.setState({ data: [] });
    }
  },

  handleSubmit() {
    this.handleChange(this.state.value);
  },

  handleFocus() {
    this.setState({ focus: true });
  },

  handleBlur() {
    this.setState({ focus: false });
  },

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
      <Input.Group className={searchCls} style={this.state.style}>
        <div id="maintain_item_search">
          <Select
            size="large"
            mode="combobox"
            value={this.state.value}
            placeholder={this.props.placeholder}
            defaultActiveFirstOption={false}
            notFoundCountent=""
            getPopupContainer={() => document.getElementById('maintain_item_search')}
            optionLabelProp="children"
            showArrow={false}
            filterOption={false}
            onSelect={this.handleSelect}
            onSearch={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={this.props.disabled}
          >
            {this.state.data.map(item => <Option key={item._id}>{item.name}</Option>)}
          </Select>
        </div>
        <div className="ant-input-group-wrap">
          {
            this.state.value.length > 1 && this.state.data.length == 0 ?
              <NewItem inputValue={this.state.value} onSuccess={this.handleOnSuccess}/> :
              <Button
                className={btnCls}
                onClick={this.handleSubmit}
                size="large">
                <Icon type="search"/>
              </Button>
          }
        </div>
      </Input.Group>
    );
  },
});

MaintainItemSearchBox.defaultProps = { placeholder: '用关键字搜索维保项目' };
export default MaintainItemSearchBox;
