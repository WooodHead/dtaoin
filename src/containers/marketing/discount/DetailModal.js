import React, {Component} from 'react';
import {Modal, Button, Row, Col, Table} from 'antd';

export default class DetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    [
      'checkDetails',
      'showModal',
      'handleOk',
      'handleCancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  checkDetails() {
    this.setState({visible: true});
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    let {data} = this.props;
    const dataSourceProject = JSON.parse(data.items);
    const dataSourceParts = JSON.parse(data.part_types);
    const discountName = data.name;
    const discountRemark = data.remark;
    const discountAmount = data.discount_amount;
    let discountAmountUpper = '';
    if (discountAmount > 0) {
      discountAmountUpper = '优惠上限: ' + discountAmount;
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
      <div className="margin-left-20" style={{display: 'inline-block'}}>
        <Button
          size="small"
          onClick={this.checkDetails}
        >
          查看详情
        </Button>

        <Modal
          title="详情信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row className="mb15">
            <Col span={12}>
              <span style={{fontSize: '18px'}}>－计次信息</span>
            </Col>
          </Row>
          <div>
            <span className="font-size-16 margin-bottom-30">名称: </span>
            <span className="font-size-14 margin-bottom-30">{discountName}</span><br/>
            <span className="font-size-16 margin-bottom-30">描述: </span>
            <span className="font-size-14 margin-bottom-30">{discountRemark}</span><br/>
            <span className="font-size-16 margin-bottom-30">{discountAmountUpper}</span>
          </div>

          <Row className="mb15 margin-top-20">
            <Col span={12}>
              <span style={{fontSize: '18px'}}>－优惠内容</span>
            </Col>
          </Row>

          <Table
            dataSource={dataSourceProject}
            columns={columnsProject}
            pagination={false}
            bordered
          />

          <Table
            className="margin-top-20"
            dataSource={dataSourceParts}
            columns={columnsParts}
            pagination={false}
            bordered
          />
        </Modal>
      </div>
    );
  }
}
