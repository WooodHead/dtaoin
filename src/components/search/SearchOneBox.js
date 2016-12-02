import React from 'react'
import {Input, Select, Button, Icon} from 'antd'
import classNames from 'classnames'
import api from '../../middleware/api'
const Option = Select.Option;

const SearchOneBox = React.createClass({
  getInitialState() {
    return {
      data: [],
      value: '',
      focus: false
    };
  },

  componentDidMount(){
    let item = this.props.value;
    if (item) {
      this.setState({value: item});
    }
  },

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.props.data;
    this.setState({value: option.props.children});

    this.props.select(list[index]);
  },

  handleSearch(key) {
    if (!!key) {
      this.setState({value: key});
      this.props.change(key);
    }
  },

  handleSubmit() {
    this.props.change(this.state.value);
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

    let {style, placeholder} = this.props;

    return (
      <Input.Group className={searchCls} style={style}>
        <Select
          size="large"
          combobox
          value={this.state.value}
          placeholder={placeholder}
          notFoundContent="未找到"
          defaultActiveFirstOption={false}
          optionLabelProp="children"
          showArrow={false}
          filterOption={false}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          onFocus={this.handleFocusBlur}
          onBlur={this.handleFocusBlur}
        >

          {this.props.data.map((item, index) =>
            <Option key={index} value={item._id}>{item.name}</Option>)}
        </Select>
        <div className="ant-input-group-wrap">
          <Button
            className={btnCls}
            size="large"
            onClick={this.handleSubmit}>
            <Icon type="search"/>
          </Button>
        </div>
      </Input.Group>
    );
  }
});

SearchOneBox.defaultProps = {placeholder: '用关键字搜索'};
export default SearchOneBox
