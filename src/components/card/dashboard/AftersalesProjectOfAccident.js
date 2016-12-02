import React from 'react'
import {Card} from 'antd'

export default class AftersalesProjectOfAccident extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {source} = this.props;

    return (
      <Card title="事故单统计" className="mb15">
        <div className="ant-table ant-table-small ant-table-bordered ant-table-body">
          <table>
            <thead className="ant-table-header">
            <tr>
              <th key="1">事故数</th>
              <th key="2">事故总产值</th>
              <th key="3">毛利润</th>
            </tr>
            </thead>
            <tbody className="ant-table-body">
            <tr>
              <td key="1" className="ant-table-row">{source.count}</td>
              <td key="2" className="ant-table-row">{source.total_fee}</td>
              <td key="3" className="ant-table-row">{source.profit}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </Card>
    )
  }
}