import React from 'react';
import { Row, Col, Modal, Input, message, Button, Icon } from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import api from '../../../middleware/api';

require('../partType.less');

export default class Type extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      superPartVisible: false,
      superPartList: [],
      secondPartList: [],
      secondPartName: '',
      superPartListOne: [],
      superPartListTwo: [],
    };

    [
      'handleSecondPartClick',
      'handleShowSuper',
      'handleHideSuper',
      'handleDelete',
      'handleCancel',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getSuperPartTypeList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue) {
      if (!this.state.secondPartName) {
        this.setState({ secondPartName: nextProps.defaultValue });
      }
    }
  }

  handleSecondPartClick(item, partTypeSuperName) {
    this.setState({
      secondPartName: `${partTypeSuperName}/${item.name}`,
      superPartVisible: false,
    });

    this.props.onSuccess(item._id, item, this.handleCancel, partTypeSuperName);
  }

  handleCancel() {
    this.setState({ secondPartName: '' });
  }

  handleShowSuper() {
    this.setState({ superPartVisible: true });
  }

  handleHideSuper() {
    this.setState({ superPartVisible: false });
  }

  handleDelete() {
    this.setState({ secondPartName: '' });
    this.props.onSuccess('');
  }

  getSuperPartTypeList() {
    api.ajax({
      url: api.warehouse.category.partAllPartTypes(),
    }, data => {
      const superPartListOne = data.res.list.slice(0, 6);
      const superPartListTwo = data.res.list.slice(6, 11);
      this.setState({ superPartListOne, superPartListTwo });
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
    });
  }

  render() {
    const { superPartVisible, secondPartName, superPartListOne, superPartListTwo } = this.state;

    return (
      <span>
        <Input
          placeholder="请选择"
          onClick={this.handleShowSuper}
          value={secondPartName}
          style={this.props.style}
          size="large"
          suffix={
            <Icon
              type="close-circle-o"
              className={secondPartName ? '' : 'hide'}
              onClick={this.handleDelete}
            />
          }
          ref={type => this.partType = type}
        />
        <Modal
          title={'请选择配件分类'}
          visible={superPartVisible}
          footer={null}
          onCancel={this.handleHideSuper}
          width={720}
        >
          <Row className="mb20">
            {
              superPartListOne.map(partTypeSuper => (
                  <Col key={partTypeSuper._id + partTypeSuper.name} span={4}>
                    <div className="super-type">{partTypeSuper.name}</div>
                    {
                      partTypeSuper.sub_list.map(partType => (
                          <div
                            className="second-type"
                            key={partType._id + partType.name}
                            onClick={() => this.handleSecondPartClick(partType, partTypeSuper.name)}
                          >
                            {partType.name}
                          </div>
                        ))
                    }
                  </Col>
                ))
            }
          </Row>
          <Row>
            {
              superPartListTwo.map(partTypeSuper => (
                  <Col key={partTypeSuper._id + partTypeSuper.name} span={4}>
                    <div className="super-type">{partTypeSuper.name}</div>
                    {
                      partTypeSuper.sub_list.map(partType => (
                          <div
                            className="second-type"
                            key={partType._id + partType.name}
                            onClick={() => this.handleSecondPartClick(partType, partTypeSuper.name)}
                          >
                            {partType.name}
                          </div>
                        ))
                    }
                  </Col>

                ))
            }
            <Col span={4}>
              <div className="super-type" />
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
