import React from 'react';
import {Input, Select, Button, Icon} from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';

const Option = Select.Option;

const PartSearchBox = React.createClass({
  getInitialState() {
    return {
      data: this.props.data ? this.props.data : [],
      part_type_id: 0,
      supplier_id: 0,
      value: this.props.value ? this.props.value : '',
      focus: false,
    };
  },

  componentDidMount(){
    let {value, part_type_id, supplier_id} = this.props;

    if (value) {
      this.setState({value});
    }

    if (part_type_id) {
      this.searchParts('', part_type_id, supplier_id);
      this.setState({part_type_id});
    }

    // 退货开单，查询该供货商的配件
    if (supplier_id) {
      this.setState({supplier_id});
    }
  },

  componentWillReceiveProps(nextProps) {
    let {part_type_id, supplier_id} = nextProps;

    if (part_type_id != this.props.part_type_id) {
      this.setState({value: ''});

      this.searchParts('', part_type_id);
      this.setState({part_type_id});
    }
    if (supplier_id !== this.props.supplier_id) {
      this.setState({supplier_id});
    }
  },

  searchParts(key, part_type_id) {
    api.ajax({url: api.warehouse.part.searchByTypeId(key, Number(part_type_id), this.state.supplier_id)}, (data) => {
      let list = data.res.list;
      this.setState({data: list});

      if (list.length > 0) {

      } else {
        // this.setState({data: [{_id: -1, scope: '', name: '搜索无结果'}]});
      }
    });
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

  handleFocus() {
    this.setState({focus: true});
  },

  handleBlur() {
    this.setState({focus: false});
  },

  render() {
    let {value, data, focus} = this.state;
    let {style, placeholder, showNewAction} = this.props;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!value,
    });

    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': focus,
    });

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
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {data.map((item) =>
            <Option key={item._id + ''}>{item.name} {item.scope} {!!item.spec ? item.spec + item.unit : ''}</Option>)}
        </Select>

        <div className="ant-input-group-wrap">
          {showNewAction && (data.length === 0 && value.length > 0) ?
            <Button
              style={{position: 'relative', left: '100px'}}
              size="large"
              onClick={() => this.props.onAdd(value)}
              type="primary"
            >
              创建配件
            </Button>
            :
            <Button className={btnCls} size="large">
              <Icon type="search"/>
            </Button>
          }
        </div>
      </Input.Group>
    );
  },
});

PartSearchBox.defaultProps = {
  showNewAction: false,
  onAdd: () => {
  },
  placeholder: '用关键字或编号搜索配件',
};

export default PartSearchBox;
