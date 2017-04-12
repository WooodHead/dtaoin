import React from 'react';
import {Row, Col, Modal, Icon, Button} from 'antd';
import BaseModal from '../../../components/base/BaseModal';

import DateFormatter from '../../../utils/DateFormatter';

import api from '../../../middleware/api';

class EditStatus extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      logs: [],
    };

    this.showUseLog = this.showUseLog.bind(this);
  }

  showUseLog() {
    this.getUseLogs(this.props._id);
  }

  getUseLogs(fixedAssetsId) {
    api.ajax({url: api.finance.fixedAssets.useLogs(fixedAssetsId)}, data => {
      this.setState({
        visible: true,
        logs: data.res.list,
      });
    });
  }

  renderLogs(detail, logs) {
    let logItems = [];
    if (logs.length > 0) {
      logs.map(log => {
        logItems.push(
          <Row className="mb10" key={log._id}>
            <Col span={4}>
              <span>{DateFormatter.day(log.mtime)}</span>
            </Col>
            <Col span={12}>
              <span className="mr10">{log.user_name}</span>
              <span className="mr10">{log.type_name}</span>
              <span className="mr10">{detail.name}</span>
              <span className="mr10">{log.count}</span>
              <span className="mr10">件</span>
            </Col>
            <Col span={8}>
              <span>描述：{log.remark}</span>
            </Col>
          </Row>
        );
      });
    } else {
      logItems.push(
        <Row type={'flex'} key="no_data">
          <Col span={24}><span className="text-gray">暂无修改记录</span></Col>
        </Row>
      );
    }

    return logItems;
  }

  render() {
    const {visible} = this.state;
    let {logs} = this.state;
    let {detail, size} = this.props;

    return (
      <span>
         {
           size === 'small'
             ?
             <a href="javascript:;" onClick={this.showUseLog}>修改记录</a>
             :
             <Button onClick={this.showUseLog}>修改记录</Button>
         }
        <Modal
          title={<span><Icon type="file-text" className="mr10"/>修改记录</span>}
          visible={visible}
          width={'640px'}
          onCancel={this.hideModal}
          footer={<Button type="primary" size="large" onClick={this.hideModal}>确定</Button>}
        >
          {this.renderLogs(detail, logs)}
        </Modal>
      </span>
    );
  }
}

export default EditStatus;
