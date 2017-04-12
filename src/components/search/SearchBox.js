import React from 'react';
import {Input, Select, Button, Icon} from 'antd';
import classNames from 'classnames';

const Option = Select.Option;

const SearchBox = React.createClass({
  getInitialState() {
    return {
      data: [],
      value: '',
      focus: false,
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
      this.setState({data: nextProps.data});
    }
  },

  handleChange(key) {
    this.setState({value: key});
    this.props.change(key);
  },

  handleSelect(itemId) {
    this.props.onSelect(itemId);
  },

  handleSubmit() {
    this.props.change(this.state.value);
  },

  handleFocus() {
    this.setState({focus: true});
  },

  handleBlur() {
    this.setState({focus: false});
  },

  render() {
    let {value, focus} = this.state;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': focus,
    });

    let {propKey, propName} = this.props;

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <Select
          size="large"
          combobox
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          value={this.state.value}
          placeholder={this.props.placeholder}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}>
          {this.state.data.map((item, index) =>
            <Option key={index} value={propKey ? item[propKey] : item.name}>
              {propName ? item[propName] : item.name}
            </Option>)
          }
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
  },
});

SearchBox.defaultProps = {placeholder: '用关键字搜索'};
export default SearchBox;
