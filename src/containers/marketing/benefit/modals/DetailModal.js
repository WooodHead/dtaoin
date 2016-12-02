import React, {Component} from 'react'
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
      'handleCancel'
    ].map(method => this[method] = this[method].bind(this));
  };

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

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  render() {
    //样式
    let style_name = {
      fontSize: '16px',
      marginBottom: '30px',
    };
    let style_content = {
      fontSize: '14px',
      marginBotton: '30px',
    };

    let {data} = this.props;
    const dataSourceProject = JSON.parse(data.items);
    const dataSourceParts = JSON.parse(data.part_types);
    const discountName = data.name;
    const discountRemark = data.remark;
    const discountAmount = data.discount_amount;

    let discountAmoutUpper = '';

    if(discountAmount > 0) {
      discountAmoutUpper = '优惠上限: ' + discountAmount;
    }

    const columnsProject = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
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
    }, {
      title: '配件',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '计费数量',
      dataIndex: 'amount',
      key: 'amount',
    }];

    return (
      <div className="margin-left-20" style={{display: 'inline-block'}}>
        <Button
          type="dashed"
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
            <Col span='12'>
              <span style={{fontSize: '18px'}}>－计次信息</span>
            </Col>
          </Row>
          <div>
              <span style={style_name}>名称: </span>
              <span style={style_content}>{discountName}</span><br/>
              <span style={style_name}>描述: </span>
              <span style={style_content}>{discountRemark}</span><br/>
              <span style={style_name}>{discountAmoutUpper}</span>
          </div>

          <Row className="mb15 margin-top-20">
            <Col span='12'>
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
  };
}
