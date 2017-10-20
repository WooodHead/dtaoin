import React from 'react';
import { Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';
import createReactClass from 'create-react-class';

const Option = Select.Option;

const SearchMultipleBox = createReactClass({
  getInitialState() {
    return {
      focus: false,
    };
  },

  componentWillMount() {
    const item = this.props.defaultValue;
    if (item) {
      this.setState({ select_value: item });
    } else {
      this.setState({ select_value: [] });
    }
  },

  handleSelect(key) {
    const value = this.state.select_value;
    value.push(key);
    this.setState({ select_value: value });

    this.props.select(this.state.select_value);
  },

  handleDeselect(key) {
    const value = this.state.select_value;
    value.splice(value.indexOf(key), 1);
    this.setState({ select_value: value });

    this.props.select(this.state.select_value);
  },

  handleChange(key) {
    if (!!key) {
      this.props.change(key);
      this.setState({ value: key });
    }
  },

  handleSubmit() {
    this.props.change(this.state.value);
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
      'ant-search-btn-noempty': !!this.state.value,
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });

    const { style, placeholder } = this.props;

    return (
      <Input.Group className={searchCls} style={style}>
        <Select
          mode="multiple"
          size="large"
          className="no-margin-bottom"
          style={{ width: '100%' }}
          defaultValue={this.state.select_value}
          placeholder={placeholder}
          notFoundContent="未找到"
          // defaultActiveFirstOption={false}
          optionLabelProp="children"
          showArrow={false}
          filterOption={false}
          onSelect={this.handleSelect}
          onDeselect={this.handleDeselect}
          onSearch={this.handleChange}
          // onFocus={this.handleFocus}
          // onBlur={this.handleBlur}
        >

          {this.props.data.map(item =>
            <Option key={item._id} value={item._id}>{item.name}</Option>)}
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
  },
});

SearchMultipleBox.defaultProps = { placeholder: '用关键字搜索' };
export default SearchMultipleBox;
