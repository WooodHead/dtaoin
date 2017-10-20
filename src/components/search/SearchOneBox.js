import React from 'react';
import { Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';
import createReactClass from 'create-react-class';

const Option = Select.Option;

const SearchOneBox = createReactClass({
  getInitialState() {
    return {
      data: [],
      value: '',
      focus: false,
    };
  },

  componentDidMount() {
    const item = this.props.value;
    if (item) {
      this.setState({ value: item });
    }
  },

  handleSelect(value, option) {
    const index = option.props.index;
    const list = this.props.data;
    this.setState({ value: option.props.children });

    this.props.select(list[index]);
  },

  handleSearch(key) {
    if (!!key) {
      this.setState({ value: key });
      this.props.change(key);
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
      'ant-search-btn-noempty': !!this.state.value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });

    const { style, placeholder } = this.props;

    return (
      <Input.Group className={searchCls} style={style}>
        <Select
          size="large"
          mode="combobox"
          value={this.state.value}
          placeholder={placeholder}
          notFoundContent="未找到"
          defaultActiveFirstOption={false}
          optionLabelProp="children"
          showArrow={false}
          filterOption={false}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
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
  },
});

SearchOneBox.defaultProps = { placeholder: '用关键字搜索' };
export default SearchOneBox;
