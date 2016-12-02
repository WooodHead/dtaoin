import React from 'react'
import {Input, Select, Button, Icon} from 'antd'
import classNames from 'classnames'
import api from '../../middleware/api'
const Option = Select.Option;

const PartSearchBox = React.createClass({
  getInitialState() {
    return {
      data: this.props.data ? this.props.data : [],
      part_type_id: 0,
      value: this.props.value ? this.props.value : '',
      focus: false
    };
  },

  componentDidMount(){
    let item = this.props.value;
    if (item) {
      this.setState({value: item});
    }

    if (this.props.part_type_id) {
        this.searchParts('', this.props.part_type_id);
        this.setState({part_type_id: this.props.part_type_id});
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.part_type_id != this.props.part_type_id) {
      this.setState({value: ''});

      this.searchParts('', nextProps.part_type_id);
      this.setState({part_type_id: nextProps.part_type_id});
    }
  },

  searchParts(key, part_type_id) {
    api.ajax({url: api.searchParts(key, Number(part_type_id))}, (data)=> {
      let list = data.res.list;
      if (list.length > 0) {
        this.setState({data: list});
      } else {
        this.setState({data: [{_id: -1, scope: '', name: '暂无该配件,请添加'}]});
      }
    })
  },

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.data;
    this.setState({value: option.props.children});

    this.props.select({data: list[index]});
  },

  handleSearch(key) {
    this.setState({value: key});
    if (!!key) {
      this.searchParts(key, this.props.part_type_id);
    } else {
      this.searchParts('', this.props.part_type_id);
    }
  },

  handleSubmit() {
    //this.props.select(this.state.data);
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

    let {value, data} = this.state;
    let {style, placeholder} = this.props;

    return (
      <Input.Group className={searchCls} style={style}>
        <Select
          size="large"
          combobox
          value={value}
          placeholder={placeholder}
          notFoundContent="未找到配件"
          defaultActiveFirstOption={false}
          optionLabelProp="children"
          showArrow={false}
          filterOption={false}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          onFocus={this.handleFocusBlur}
          onBlur={this.handleFocusBlur}>
          {data.map((item, index) =>
            <Option key={item._id} value={item._id}>{item.name} {item.scope}</Option>)}
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

PartSearchBox.defaultProps = {placeholder: '用关键字或编号搜索配件'};
export default PartSearchBox