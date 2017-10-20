import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import InfoDropDown from '../../../components/widget/InfoDropDown';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      partsId: '',
      enterPartInfo: '',
    };

    [
      'handleRowSelect',
      'handleCheckPart',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleRowSelect(selectedRowKeys) {
    this.setState({ partsId: selectedRowKeys.join(',') });
  }

  handleCheckPart(enterPartInfo) {
    this.setState({ enterPartInfo });
  }

  render() {
    const { page, partsId, enterPartInfo } = this.state;
    const rowSelection = {
      onChange: this.handleRowSelect,
    };

    return (
      <div>
        <InfoDropDown partInfo={enterPartInfo}/>

        <Row className="mb10">
          <Col span={24}>
            <Link to={{ pathname: `/warehouse/purchase/new/${partsId}` }}>
              <Button
                className="pull-right"
                type="primary"
                disabled={!partsId}
              >
                批量补货
              </Button>
            </Link>
          </Col>
        </Row>

        <span className="aftersales-inventory-warn">
          <Table
            page={page}
            source={api.warehouse.part.partLowAmountList(this.state.page)}
            updateState={this.updateState}
            rowSelection={rowSelection}
            onCheckPart={this.handleCheckPart}
          />
        </span>
      </div>
    );
  }
}
