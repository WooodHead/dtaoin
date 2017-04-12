import React from 'react';
import {Modal, Button, Row, Col, Table} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

export default class Detail extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    let {data, size} = this.props;
    const dataSourceProject = JSON.parse(data.items);
    const dataSourceParts = JSON.parse(data.part_types);
    const discountName = data.name;
    const discountRemark = data.remark;
    const discountAmount = data.max_discount_amount;
    let discountAmountUpper = '';
    if (discountAmount > 0) {
      discountAmountUpper = discountAmount;
    }

    const columnsProject = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '优惠数量',
      dataIndex: 'amount',
      key: 'amount',
    }];

    const columnsParts = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '配件',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '优惠数量',
      dataIndex: 'amount',
      key: 'amount',
    }];

    return (
      <span>
        {
          size === 'small'
            ?
            <a href="javascript:;" onClick={this.showModal}>查看详情</a>
            :
            <Button onClick={this.showModal}>查看详情</Button>
        }
        <Modal
          title="详情信息"
          visible={this.state.visible}
          onOk={this.showModal}
          onCancel={this.hideModal}
        >
          <Row className="mb15">
            {
              Number(data.type) === 1 ?
                <Col span={12}>
                  <h3>计次信息</h3>
                </Col>
                :
                <Col span={12}>
                  <h3>折扣信息</h3>
                </Col>
            }
          </Row>
          <div className="with-bottom-divider">
            <Row>
              <Col span={12}><span className="label text-gray">名称</span>{discountName}</Col>
              <Col span={12}><span className="label text-gray">描述</span>{discountRemark}</Col>

            </Row>
            {
              Number(discountAmountUpper) > 0 ?
                <Row className="mt20">
                  <Col span={12}>
                    <span className="label text-gray">优惠上限</span>{discountAmountUpper}
                  </Col>
                </Row>
                :
                ''
            }
          </div>
          <Row className="mb15 mt20">
            <Col span={12}>
              <h3>优惠内容</h3>
            </Col>
          </Row>

          <Table
            dataSource={dataSourceProject}
            columns={columnsProject}
            pagination={false}
            bordered
          />

          <Table
            className="mt20"
            dataSource={dataSourceParts}
            columns={columnsParts}
            pagination={false}
            bordered
          />
        </Modal>
      </span>
    );
  }
}
