import React from 'react'
import {Input, Select, Button, Icon} from 'antd'
import classNames from 'classnames'
const Option = Select.Option;

const SearchMultipleBox = React.createClass({
  getInitialState() {
    return {
      focus: false
    };
  },

  componentWillMount(){
    let item = this.props.defaultValue;
    if (item) {
      this.setState({select_value: item});
    } else {
      this.setState({select_value: []});
    }
  },

  handleSelect(key, option) {
    let value = this.state.select_value;
    value.push(key);
    this.setState({select_value: value});

    this.props.select(this.state.select_value);
  },

  handleDeselect(key, option) {
    let value = this.state.select_value;
    value.splice(value.indexOf(key), 1);
    this.setState({select_value: value});

    this.props.select(this.state.select_value);
  },

  handleChange(key) {
    if (!!key) {
      this.props.change(key);
      this.setState({value: key});
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
      'ant-search-btn-noempty': !!this.state.value
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus
    });

    let {style, placeholder} = this.props;

    return (
      <Input.Group className={searchCls} style={style}>
        <Select
          multiple
          className="no-margin-bottom"
          style={{ width: '100%' }}
          defaultValue={this.state.select_value}
          placeholder={placeholder}
          notFoundContent="未找到"
          //defaultActiveFirstOption={false}
          optionLabelProp="children"
          showArrow={false}
          filterOption={false}
          onSelect={this.handleSelect}
          onDeselect={this.handleDeselect}
          onSearch={this.handleChange}
          //onFocus={this.handleFocusBlur}
          //onBlur={this.handleFocusBlur}
        >

          {this.props.data.map((item, index) =>
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
  }
});

SearchMultipleBox.defaultProps = {placeholder: '用关键字搜索'};
export default SearchMultipleBox