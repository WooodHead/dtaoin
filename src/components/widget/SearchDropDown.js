import React, { Component } from 'react';
import { Table } from 'antd';
import New from '../../containers/warehouse/part/New';

const noResult = require('../../images/noresult.png');
const toastClose = require('../../images/btn_toast_close.png');

export default class SearchDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partsInfo: '',
    };
    [
      'handleTableRowClick',
      'handleCancel',
      'handleSuccess',
      'eventListenerFun',
    ].map(method => this[method] = this[method].bind(this));
  }

  eventListenerFun() {
    let { partsInfo } = this.state;
    if (!partsInfo) {
      partsInfo = {};
    }
    partsInfo.visible = false;
    this.setState({ partsInfo });
    this.handleCancel();
  }

  componentDidMount() {
    document.addEventListener('click', this.eventListenerFun, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.eventListenerFun, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.partsInfo) {
      if (nextProps.partsInfo.visible) {
        document.addEventListener('click', this.eventListenerFun, false);
      }
      this.setState({ partsInfo: nextProps.partsInfo }, () => {
        if (!nextProps.partsInfo.keyword) {
          this.handleCancel();
        }
      });
    }
  }

  handleTableRowClick(value) {
    this.handleCancel();
    this.props.onTableRowClick(value);
    this.props.onCancel && this.props.onCancel();
  }

  handleCancel() {
    const { partsInfo } = this.state;
    partsInfo.visible = false;
    document.removeEventListener('click', this.eventListenerFun, false);
    this.setState({ partsInfo });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleSuccess(data) {
    this.props.onTableRowClick(data);
  }

  handleClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { partsInfo } = this.state;
    const { isInsertPart } = this.props;

    const dataSource = partsInfo.info ? partsInfo.info : [];
    let width = dataSource && dataSource.length === 0 ? '210px' : '800px';

    // 像退货之类的不需要搜索不到 添加配件  宽度不需要减小
    if (dataSource && dataSource.length === 0) {
      width = isInsertPart === 'false' ? '800px' : '210px';
    }

    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
        width: '20%',
      }, {
        title: '规格',
        dataIndex: 'spec',
        key: 'spec',
        width: '15%',
        render: (value, record) => `${value}${record.unit}`,
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '10%',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
        width: '20%',
      }, {
        title: '剩余库存',
        dataIndex: 'amount',
        key: 'amount',
        width: '15%',
        render: (value, record) => Number(value) - Number(record.freeze),
      }];

    let style = { display: 'none' };

    if (partsInfo.coordinate) {
      style = {
        position: 'absolute',
        width,
        left: `${partsInfo.coordinate.left}px` || '',
        top: `${partsInfo.coordinate.top + 10}px` || '',
        display: partsInfo.visible ? '' : 'none',
        zIndex: 9998,
        backgroundColor: 'white',
      };
    }

    return (
      <div style={style} onClick={this.handleClick}>
        <img src={toastClose} className="close" onClick={this.handleCancel} />
        {
          isInsertPart !== 'false' && dataSource && dataSource.length === 0 ?
            <div className="padding-20 center" style={{ boxShadow: '0 0 4px #cccccc' }}>
              <img src={noResult} style={{ width: '40px', height: '40px' }} />
              <p>暂时没有找到该配件，请更换关键字查询或创建新配件</p>
              <div className="mt10">
                <New
                  onSuccess={this.handleSuccess}
                  hideModal={this.handleCancel}
                  inputValue={partsInfo.keyword}
                />
              </div>
            </div> : <Table
              dataSource={dataSource}
              columns={columns}
              size="small"
              bordered={false}
              pagination={false}
              onRowClick={this.handleTableRowClick}
              rowKey={record => record._id}
              scroll={{ y: 200 }}
            />
        }
      </div>
    );
  }
}
