import React from 'react';
import {
  Table,
  Icon,
  Tabs,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  Popconfirm,
} from 'antd';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

class HQMaterialSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      applicationVisible: false,
      pickupModuleVisible: false,
      delivery_Data: [],
      application_Data: [],
    };
  }

  show_applicationModule = () => {
    this.setState({
      applicationVisible: true,
    });
  };
  show_pickupModule = () => {
    this.setState({
      pickupModuleVisible: true,
    });
  };
  cancelpickupModule = () => {
    this.setState({ pickupModuleVisible: false });
  };
  cancelapplicationModule = () => {
    this.setState({ applicationVisible: false });
  };

  onChange = (record, e) => {
    const application_Data = this.state.application_Data;
    if (e.target.checked) {
      this.setState({ application_Data: [...application_Data, record] });
    }
    if (e.target.checked == false) {
      this.deleteApplication_Data(record._id);
    }
  };
  onChangePickup = (record, e) => {
    const delivery_Data = this.state.delivery_Data;
    if (e.target.checked) {
      this.setState({ delivery_Data: [...delivery_Data, record] });
    }
    if (e.target.checked == false) {
      this.deleteDelivery_Data(record._id);
    }
  };
  post_editMaterial = () => {
    const delivery_Data = this.state.delivery_Data;
    const application_Data = this.state.application_Data;
    const application_material_ids = [];
    const pickup_material_ids = [];
    for (var i = 0, len = application_Data.length; i < len; i++) {
      application_material_ids.push(application_Data[i]._id);
    }
    
    for (var i = 0, len = delivery_Data.length; i < len; i++) {
      pickup_material_ids.push(delivery_Data[i]._id);
    }
    
    const strApplication_material_ids = application_material_ids.join(',');
    const strPickup_material_ids = pickup_material_ids.join(',');
    const product_id = this.props.postProductCreateRes.detail._id;
    const data = {
      product_id,
      application_material_ids: strApplication_material_ids,
      pickup_material_ids: strPickup_material_ids,
    };
    this.props.post_market_edit_material(data);
  };
  deleteApplication_Data = _id => {
    const application_Data = [...this.state.application_Data];
    this.setState({
      application_Data: application_Data.filter(application_Data => application_Data._id !== _id),
    });
  };
  deleteDelivery_Data = _id => {
    const delivery_Data = [...this.state.delivery_Data];
    this.setState({
      delivery_Data: delivery_Data.filter(delivery_Data => delivery_Data._id !== _id),
    });
  };

  render() {
    const getMarketMaterialListData = this.props.getMarketMaterialListData;
    const getMarketMaterialListData_list = getMarketMaterialListData.list;
    const applicationColumns = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
              <Checkbox onChange={e => this.onChange(record, e)}></Checkbox>
          </span>
        ),
      }];
    const pickupColumns = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
              <Checkbox onChange={e => this.onChangePickup(record, e)}></Checkbox>
          </span>

        ),
      }];
    const columnsModuleApplication = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Popconfirm title="确定要删除此项吗?" onConfirm={() => this.deleteApplication_Data(record._id)}>
              <a href="#">删除</a>
            </Popconfirm>
          ),
      }];
    // 删除columnsModuleDelivery
    const columnsModuleDelivery = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <Popconfirm title="确定要删除此项吗?" onConfirm={() => this.deleteDelivery_Data(record._id)}>
              <a href="#">删除</a>
            </Popconfirm>
          ),
      }];
    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={8}>申请材料</Col>
          <Col span={16}>
            <Button style={{ float: 'right' }} onClick={this.show_applicationModule}>
              添加材料
            </Button>
          </Col>
          <Modal
            visible={this.state.applicationVisible}
            onCancel={this.cancelapplicationModule}
            maskClosable={true}
            footer={null}
            title="申请新增材料"
          >
            <Table columns={applicationColumns} dataSource={getMarketMaterialListData_list}
                   pagination={true} />
          </Modal>
        </Row>
        <div>
          <Table columns={columnsModuleApplication} dataSource={this.state.application_Data}
                 pagination={false} />
        </div>
        <Row className="head-action-bar-line mb20" style={{ marginTop: 30 }}>
          <Col span={8}>交车材料</Col>
          <Col span={16}>
            <Button style={{ float: 'right' }} onClick={this.show_pickupModule}>
              添加材料
            </Button>
          </Col>
          <Modal
            visible={this.state.pickupModuleVisible}
            onCancel={this.cancelpickupModule}
            maskClosable={true}
            footer={null}
            title="交车新增材料"
          >
            <Table columns={pickupColumns} dataSource={getMarketMaterialListData_list}
                   pagination={true} />
          </Modal>
        </Row>
        <Table columns={columnsModuleDelivery} dataSource={this.state.delivery_Data}
               pagination={false} />
        <Row type="flex" justify="center" style={{ marginTop: 40 }}>
          <Col span={4}>
            <Button type="primary" onClick={this.post_editMaterial}>保存</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HQMaterialSetting;

