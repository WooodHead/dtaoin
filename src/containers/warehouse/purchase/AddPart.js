import React from 'react';
import { Modal, Form, Row, Col, Button, Input } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

import Type from '../part/Type';
import BaseModal from '../../../components/base/BaseModal';
import Table from './TableAddParts';

const FormItem = Form.Item;
const Search = Input.Search;

export default class AddPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: false,
      visible: false,
      visibleNewPart: false,
      parts: new Map(),
      price: '',
      count: '',
      key: '',
      partType: '',
      brand: '',
      scope: '',
      status: '',
      page: 1,
    };

    [
      'handleSearchPartChange',
      'handleTableRowClick',
      'updateState',
      'handleBrandChange',
      'handleScopeChange',
      'handleTypeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ parts: nextProps.partsMap });
  }

  showModal() {
    this.setState({
      visible: true,
      reload: true,
      key: '',
    });
  }

  updateState(obj) {
    this.setState(obj);
  }

  handleBrandChange(e) {
    const brand = e.target.value;
    this.setState({ brand, page: 1 });
  }

  handleScopeChange(e) {
    const scope = e.target.value;
    this.setState({ scope, page: 1 });
  }

  handleTypeChange(pid) {
    this.setState({ partType: pid, page: 1 });
  }

  handleSearchPartChange(e) {
    const key = e.target.value;
    this.setState({ key, page: 1 });
  }

  handleTableRowClick(part) {
    const { parts } = this.state;
    if (parts.has(part._id)) {
      parts.delete(part._id);
    } else {
      part.remain_amount = part.amount;
      part.part_name = part.part_name || part.name;
      part.amount = 1;
      parts.set(part._id, part);
    }

    this.setState({ parts });
    this.props.onPartsChange(parts);
  }

  render() {
    const { formItemThree } = Layout;
    const { visible, key, parts } = this.state;
    return (
      <span>
        <Button onClick={this.showModal}>添加配件</Button>

        <Modal
          title="添加配件"
          visible={visible}
          width={960}
          onCancel={this.hideModal}
          footer={null}
        >
          <Row className="mb10">
            <Col span={6}>
              <FormItem label="搜索配件" {...formItemThree}>
                <Search
                  onChange={this.handleSearchPartChange}
                  size="large"
                  placeholder="全部"
                  value={key}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="品牌" {...formItemThree}>
               <Search
                 onChange={this.handleBrandChange}
                 size="large"
                 placeholder="全部"
               />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="适用车型" {...formItemThree}>
                <Search
                  onChange={this.handleScopeChange}
                  size="large"
                  placeholder="全部"
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="配件分类" {...formItemThree}>
                <Type onSuccess={this.handleTypeChange} />
              </FormItem>
            </Col>
          </Row>

          <Table
            source={api.warehouse.part.list(this.state)}
            page={this.state.page}
            updateState={this.updateState}
            handleRowClick={this.handleTableRowClick}
            parts={parts}
            reload={this.state.reload}
            keyword={key}
          />
        </Modal>
      </span>
    );
  }
}
