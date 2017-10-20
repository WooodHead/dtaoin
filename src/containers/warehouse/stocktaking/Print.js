import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Icon, Spin, Table, Button } from 'antd';

import BasePrint from '../../../components/base/BasePrint';

import api from '../../../middleware/api';

export default class Print extends BasePrint {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isFetching: false,
      parts: [],
    };

    this.showPrintModal = this.showPrintModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
  }

  showPrintModal() {
    this.getStocktakingParts(this.props.id);
    this.setState({
      visible: true,
      isFetching: true,
    });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  handlePrint() {
    const printSection = ReactDOM.findDOMNode(this.refs.print_container);

    this.printThis({
      element: $(printSection),
      debug: false,
      importCSS: true,
      importStyle: true,
      printContainer: false,
      loadCSS: '/dist/print.css',
      pageTitle: '仓库盘点单',
      removeInline: false,
      printDelay: 300,
      header: '',
      footer: null,
      formValues: true,
    });
  }

  getStocktakingParts(id) {
    api.ajax({
      url: api.warehouse.stocktaking.getAllParts(id),
    }, data => {
      this.setState({
        isFetching: false,
        parts: data.res.list,
      });
    });
  }

  render() {
    const { visible, isFetching, parts } = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: 'index',
        className: 'center',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '配件分类',
        dataIndex: 'auto_part.part_type_name',
        key: 'part_type_name',
      }, {
        title: '配件名',
        dataIndex: 'auto_part.name',
        key: 'name',
      }, {
        title: '配件号',
        dataIndex: 'auto_part.part_no',
        key: 'part_no',
      }, {
        title: '适用车型',
        dataIndex: 'auto_part.scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'auto_part.brand',
        key: 'brand',
      }, {
        title: '实际数量',
        dataIndex: '',
        key: 'real_amount',
        className: 'center',
      }];

    return (
      <span>
        <Button type="ghost" onClick={this.showPrintModal}>打印盘点单</Button>

        <Modal
          title={<span><Icon type="file-text"/> 打印盘点单</span>}
          visible={visible}
          maskClosable={false}
          width={960}
          onCancel={this.hideModal}
          onOk={this.handlePrint}
          okText="确认打印"
        >
          <Spin spinning={isFetching}>
            <div ref="print_container">
              <Table
                dataSource={parts}
                columns={columns}
                pagination={false}
                size="small"
                bordered
              />
            </div>
          </Spin>
        </Modal>
      </span>
    );
  }
}
