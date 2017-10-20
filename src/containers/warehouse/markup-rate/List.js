import React from 'react';
import { Row, Col, message, Button, Modal, Form } from 'antd';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import Table from './Table';

import NumberInput from '../../../components/widget/NumberInput';

require('../category.less');

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      superPartList: [],
      currentId: '',
      page: 1,
      pid: 1,
      visible: false,
      partsId: '',
      reload: false,
    };

    [
      'handleSuperPartClick',
      'handleRowSelect',
      'hideModal',
      'showModal',
      'handleSubmit',
      'handleReload',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSuperPartTypeList();
  }

  handleSuperPartClick(e, item) {
    this.setState({ currentId: item._id, pid: item._id });
  }

  handleRowSelect(selectedRowKeys) {
    this.setState({ partsId: selectedRowKeys.join(',') });
  }

  handleReload() {
    this.setState({ reload: true });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.markup_rate = Number(values.markup_rate) / 100;
      values.part_types = this.state.partsId;

      api.ajax({
        url: api.warehouse.part.partTypeMarkup(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('修改成功！');
        this.setState({ reload: true });
        this.hideModal();
      });
    });
  }

  hideModal() {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  showModal() {
    this.setState({ visible: true });
  }

  getSuperPartTypeList() {
    api.ajax({
      url: api.warehouse.category.superPartTypeList(),
    }, data => {
      this.setState({
        superPartList: data.res.list,
        currentId: data.res.list[0]._id,
        pid: data.res.list[0]._id,
      });
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
    });
  }

  render() {
    const { superPartList, currentId, page, pid, partsId } = this.state;
    const rowSelection = {
      onChange: this.handleRowSelect,
    };

    return (
      <Form style={{ marginLeft: '-20px' }}>
        <Row>
          <Col className="top-category" span={6}>
            <p>配件分类</p>
            <ul>
              {
                superPartList.map(item => {
                  const isActive = Number(item._id) === Number(currentId);
                  return (
                    <li
                      className={isActive ? 'active' : ''}
                      key={item._id}
                      onClick={() => this.handleSuperPartClick(this, item)}
                    >
                      {item.name}
                    </li>
                  );
                })
              }
            </ul>
          </Col>
          <Col className="second-category" span={18}>
            <p>
              <Button
                onClick={this.showModal}
                className="pull-right mt7 mr10"
                disabled={!partsId}
              >
                设置加价率
              </Button>
            </p>
            <div>
              <Table
                rowSelection={rowSelection}
                source={api.warehouse.category.partTypeFullList(pid, page)}
                page={page}
                updateState={this.updateState}
                onSuccess={this.handleReload}
                reload={this.state.reload}
              />
            </div>
          </Col>
        </Row>

        <Modal
          title="批量设置加价率"
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={[
            <Button key="buttonSave" type="primary" onClick={this.handleSubmit}>保存</Button>,
            <Button key="buttonCancel" onClick={this.hideModal}>取消</Button>,
          ]}
        >
          <Row>
            <Col span={20}>
              <NumberInput
                id="markup_rate"
                label="加价率"
                rules={[{ required: true, message: '请输入加价率' }]}
                unit="%"
                isInt={true}
                self={this}
              />
            </Col>
          </Row>
        </Modal>
      </Form>
    );
  }
}

List = Form.create()(List);
export default List;
