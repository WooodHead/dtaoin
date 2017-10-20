import React from 'react';
import { Button, Table, Badge, message } from 'antd';

import ImagePreview from './ImagePreview';

export default class ApplicationInfo extends React.Component {
  constructor(props) {
    super(props);
    [
      'handleDownload',
      'handleBatchDownload',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleRowSelect(selectedRows) {
    this.props.rowSelectChange(selectedRows);
  }

  handleBatchDownload() {
    const { downloadInfo } = this.props;
    downloadInfo.forEach(item => {
      this.handleDownload(item);
    });
  }

  handleDownload(record) {
    let content = [];
    try {
      content = JSON.parse(record.content);
    } catch (e) {
      message.error('无下载内容');
      return false;
    }

    content.forEach(item => {
      try {
        const pics = item.upload_pics.split(',');
        pics.forEach(pic => {
          this.getPic(pic);
        });
      } catch (e) {
        message.error('无下载内容');
      }
    });
  }

  getPic(pic) {
    this.props.getPic(pic, this.downloadPic);
  }

  downloadPic(url) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', '-');
    a.click();
  }

  render() {
    const { applicationMaterialList, downloadInfo } = this.props;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleRowSelect(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: Number(record.status) === 0,
      }),
    };

    const self = this;
    const columns = [
      {
        title: '材料名称',
        dataIndex: 'material_name',
        key: 'material_name',
      }, {
        title: '描述',
        dataIndex: 'material_remark',
        key: 'material_remark',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: value => {
          let badge = 'default';
          if (Number(value) === 0) {
            badge = 'default';
          } else if (Number(value) === 1) {
            badge = 'success';
          }
          return <Badge status={badge} text={`${Number(value) === 0 ? '未' : '已'  }上传`} />;
        },
      }, {
        title: '更新时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '操作',
        key: 'active',
        render(value, record) {
          return (
            <div>
              <ImagePreview
                record={record}
                getPic={self.props.getPic}
                disabled={Number(record.status) === 0}
              />
              <span className="ant-divider" />
              <a
                href="javascript:;"
                onClick={() => self.handleDownload(record)}
                disabled={Number(record.status) === 0}
              >
                下载
              </a>
            </div>
          );
        },
      }];

    return (
      <div>
        <Button
          className="mb10"
          disabled={downloadInfo.length <= 0}
          onClick={this.handleBatchDownload}
        >
          批量下载
        </Button>

        <Table
          rowSelection={rowSelection}
          rowKey={record => record._id}
          columns={columns}
          dataSource={applicationMaterialList}
        />
      </div>
    );
  }
}
