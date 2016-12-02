import React from 'react'
import {Input, Select, Button, Icon, message} from 'antd'
import classNames from 'classnames'

const SearchBox = React.createClass({
  getInitialState() {
    return {
      data: [],
      value: '',
      focus: false
    };
  },

  componentDidMount(){
    let value = this.props.value;
    if (!!value) {
      this.setState({value: value});
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.data && this.props.data.length != nextProps.data.length) {
      this.setState({data: nextProps.data})
    }
  },

  handleChange(key) {
    //if (!!key) {
      this.setState({value: key});
      this.props.change(key);
    //}
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
    const Option = Select.Option;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim()
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
      'mb15': true
    });

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          size="large"
          combobox
          onChange={this.handleChange}
          value={this.state.value}
          placeholder={this.props.placeholder}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onFocus={this.handleFocusBlur}
          onBlur={this.handleFocusBlur}>
          {this.state.data.map((item, index) =>
            <Option key={index} value={item.name}>{item.name}</Option>)}
        </Select>
        <div className="ant-input-group-wrap">
          <Button
            className={btnCls}
            onClick={this.handleSubmit}
            size="large">
            <Icon type="search"/>
          </Button>
        </div>
      </Input.Group>
    );
  }
});

SearchBox.defaultProps = {placeholder: '用关键字搜索'};
export default SearchBox
