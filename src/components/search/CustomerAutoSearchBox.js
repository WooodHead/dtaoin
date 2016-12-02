import React from 'react'
import {Input, Select, Button, Icon} from 'antd'
import classNames from 'classnames'
import api from '../../middleware/api'
import NewCustomerAutoModal from '../modals/aftersales/NewCustomerAutoModal'

const Option = Select.Option;

class CustomerAutoSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{'_id': 0, 'customer_name':'', 'customer_phone':'手机号、车牌号搜索', 'plate_num':''}],
      value: '',
      focus: false
    };
    [
      'handleOnSuccess',
      'handleSearch',
      'handleSelect',
      'handleFocusBlur'
    ].forEach((method) => this[method] = this[method].bind(this));
  }
  
  handleOnSuccess(data) {
    this.setState({value: data.customer_phone, data: [data]});
    this.props.select(data);
  }

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.data;
    this.setState({value: option.props.children});

    this.props.select(list[index]);
  }

  handleSearch(key) {
    this.setState({value: key});
    if (!!key) {
      let keyType = Number(key);
      if (isNaN(keyType) && key.length < 2) {
        return false;
      }
      // phone number
      if (!isNaN(keyType) && key.length < 6) {
        return false;
      }

      api.ajax({url: api.searchCustomerAutos(key)}, (data)=> {
        let list = data.res.list;
        if (list.length > 0) {
          this.setState({data: list});
        } else {
          this.setState({data: []});
        }
      })
    }
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  }

  render() {
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus
    });

    return (
      <Input.Group className={searchCls} style={this.props.style}>
        <div id="customer_auto_search">
          <Select
            size="large"
            //combobox={this.state.data.length}
            combobox
            //showSearch
            value={this.state.value}
            placeholder={this.props.placeholder}
            defaultActiveFirstOption={false}
            notFoundCountent=''
            getPopupContainer={() => document.getElementById('customer_auto_search')}
            optionLabelProp="children"
            showArrow={false}
            filterOption={false}
            onSelect={this.handleSelect}
            onSearch={this.handleSearch}>
            {this.state.data.map((item, index) =>
              <Option key={item._id} value={item._id}>{item.customer_name} {item.customer_phone} {item.plate_num}</Option>)}
          </Select>
        </div>
        <div className="ant-input-group-wrap">
          {
              this.state.value.length > 0 & this.state.data.length == 0 ?
              <NewCustomerAutoModal inputValue={this.state.value} onSuccess={this.handleOnSuccess} size="default"/>
              :
              <Button
                className={btnCls}
                size="large">
                <Icon type="search"/>
              </Button>
          }
        </div>
      </Input.Group>
    );
  }
}

CustomerAutoSearchBox.defaultProps = {
  placeholder: '请用手机号、车牌号、或姓名搜索'
};

export default CustomerAutoSearchBox
