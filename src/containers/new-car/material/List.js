import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Row, Col } from 'antd';

import BaseList from '../../../components/base/BaseList_';

import New from './New';
import Table from './Table';

import {
  getMaterialList,
  setPage,
  editMaterial,
  createMaterial,
} from '../../../reducers/new-car/material/materialActions';
import { getResourceList } from '../../../reducers/new-car/earnings-record/earningsRecordActions';

class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      listName: 'getMaterialList',
      paramsChange: ['page'],
    };

    [
      'handleMaterialCreate',
      'handleMaterialEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.props.actions.getMaterialList();
    this.props.actions.getResourceList();
  }

  handleMaterialEdit(data, callback) {
    this.props.actions.editMaterial(data, callback);
  }

  handleOffLine(id) {
    this.props.actions.bannerOffLine(id);
  }

  handleMaterialCreate(data) {
    this.props.actions.createMaterial(data);
  }

  render() {
    const { isFetching, page, list, total, resourceList } = this.props;
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <New
                onSuccess={this.handleSuccess}
                resourceList={resourceList}
                createMaterial={this.handleMaterialCreate}
              />
            </div>
          </Col>
        </Row>

        <span className="new-car-banner">
          <Table
            updatePage={this.updatePage}
            onSuccess={this.handleSuccess}
            isFetching={isFetching}
            page={page}
            list={list}
            total={total}

            resourceList={resourceList}
            materialEdit={this.handleMaterialEdit}
          />
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, page, list, total } = state.newCarMaterial;
  const { resourceList } = state.newCarEarningsRecord;
  return { isFetching, page, list, total, resourceList };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getMaterialList,
      setPage,
      editMaterial,
      createMaterial,
      getResourceList,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
