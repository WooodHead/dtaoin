import React from 'react'
import {Input, Select, Button, Icon} from 'antd'
import classNames from 'classnames'
import api from '../../middleware/api'
import NewItem from '../modals/maintain-item/NewItem'

const Option = Select.Option;

const MaintainItemSearchBox = React.createClass({
  getInitialState() {
    return {
      data: this.props.data ? this.props.data : [],
      value: this.props.value ? this.props.value : '',
      focus: false
    };
  },

  handleOnSuccess(data) {
    this.setState({value: data.name, data: [data]});

    this.props.select(data);
  },

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.data;
    console.log(option.props.children);
    this.setState({value: option.props.children});

    this.props.select(list[index]);
  },

  handleChange(key) {
    this.setState({value: key});

    if (!!key && key.length >= 2) {
      api.ajax({url: api.searchMaintainItems(key)}, (data)=> {
        let list = data.res.item_list;
        if (list.length > 0) {
          this.setState({data: list});
        } else {
          this.setState({data: []});
        }
      })
    } else {
      this.setState({data: []});
    }
  },

  handleSubmit() {
    this.handleChange(this.state.value);
  },

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  },

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
        <div id="maintain_item_search">
          <Select
            size="large"
            //combobox={this.state.data.length}
            combobox
            //showSearch
            value={this.state.value}
            placeholder={this.props.placeholder}
            defaultActiveFirstOption={false}
            notFoundCountent=''
            getPopupContainer={() => document.getElementById('maintain_item_search')}
            optionLabelProp="children"
            showArrow={false}
            filterOption={false}
            onSelect={this.handleSelect}
            onSearch={this.handleChange}>
            {this.state.data.map((item, index) => <Option key={index} value={item._id}>{item.name}</Option>)}
          </Select>
        </div>
        <div className="ant-input-group-wrap">
          {
              this.state.value.length > 0 & this.state.data.length == 0 ?
              <NewItem inputValue={this.state.value} onSuccess={this.handleOnSuccess} />
              :
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
  }
});

MaintainItemSearchBox.defaultProps = {placeholder: '用关键字搜索维保项目'};
export default MaintainItemSearchBox
