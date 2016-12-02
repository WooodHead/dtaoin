import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
require('./middleware/userstatus');
import App from './containers/App'
import Register from './containers/Register'
import Login from './containers/Login'

import PresalesStatistics from './containers/dashboard/PresalesStatistics'
import AftersalesStatistics from './containers/dashboard/AftersalesStatistics'

import PresalesPotentialList from 'containers/presales/potential/List'
import PresalesPotentialDetail from 'containers/presales/potential/Detail'
import PresalesCustomerList from 'containers/presales/customer/List'
import PresalesCustomerDetail from 'containers/presales/customer/Detail'

import AftersalesProjectList from 'containers/aftersales/project/List'
import AftersalesProjectDetail from 'containers/aftersales/project/Detail'
import AftersalesProjectCreate from 'containers/aftersales/project/Create'
import AftersalesPotentialList from 'containers/aftersales/potential/List'
import AftersalesCustomerList from 'containers/aftersales/customer/List'
import AftersalesCustomerDetail from 'containers/aftersales/customer/Detail'

import WarehousePartList from 'containers/warehouse/part/List'
import WarehousePartStore from 'containers/warehouse/part/Store'
import WarehousePartDetail from 'containers/warehouse/part/Detail'
import WarehouseCategoryList from 'containers/warehouse/category/List'
import WarehouseSupplierList from 'containers/warehouse/supplier/List'
import WarehousePartEntryLogList from 'containers/warehouse/partEntryLog/List'

import MaintainItemList from 'containers/maintain-item/List'

import FinanceExpenseList from 'containers/finance/ExpenseList'
import FinancePresalesIncomeList from 'containers/finance/PresalesIncomeList'
import FinanceAfterSalesIncomeList from 'containers/finance/AftersalesIncomeList'
import FinanceAfterSalesIncomeTransferList from 'containers/finance/AftersalesIncomeTransferList'
import FinanceIncomeStatementCheck from 'containers/finance/IncomeStatementCheck'
import AppDownload from 'containers/company/AppDownload'

import PersonnelUserList from 'containers/personnel/user/List'
import PersonnelUserDetail from 'containers/personnel/user/Detail'
import PersonnelSalaryList from 'containers/personnel/salary/List'

import CompanyList from 'containers/company/List'
import CompanyBoard from 'containers/company/board'
import AdvertList from 'containers/advert/List'
import ActivityList from 'containers/activity/List'
import CommentList from 'containers/comment/List'


import Timecount from 'containers/marketing/benefit/Timecount'
import CreateTimecout from 'containers/marketing/benefit/CreateTimecout'
import Discount from 'containers/marketing/benefit/Discount'
import CreateDiscount from 'containers/marketing/benefit/CreateDiscount'
import Minus from 'containers/marketing/minus/Minus'
import CreateMinus from 'containers/marketing/minus/CreateMinus/CreateMinus'


import MemberCardTypeList from 'containers/marketing/membercardtype/MembershipCardList'
import MemberCardTypeCreate from 'containers/marketing/membercardtype/MembershipCardCreate'
import MemberCardTypeInfo from 'containers/marketing/membercardtype/MembershipCardInfo'
import MemberCardSaleLog from 'containers/marketing/membercard/SaleLog'
import MemberCardSale from 'containers/marketing/membercard/Sale'

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      {/*// 报表*/}
      <Route path="dashboard">
        <Route path="presales" component={PresalesStatistics}/>
        <Route path="aftersales" component={AftersalesStatistics}/>
      </Route>

      {/*// 销售*/}
      <Route path="presales">
        <Route path="potential">
          <Route path="list" component={PresalesPotentialList}/>
          <Route path="detail" component={PresalesPotentialDetail}/>
        </Route>

        <Route path="customer">
          <Route path="list" component={PresalesCustomerList}/>
          <Route path="detail" component={PresalesCustomerDetail}/>
        </Route>
      </Route>

      {/*// 售后*/}
      <Route path="aftersales">
        <Route path="project">
          <Route path="list" component={AftersalesProjectList}/>
          <Route path="detail" component={AftersalesProjectDetail}/>
          <Route path="create" component={AftersalesProjectCreate}/>
        </Route>

        <Route path="potential">
          <Route path="list" component={AftersalesPotentialList}/>
          <Route path="detail" component={AftersalesCustomerDetail}/>
        </Route>

        <Route path="customer">
          <Route path="list" component={AftersalesCustomerList}/>
          <Route path="detail" component={AftersalesCustomerDetail}/>
        </Route>
      </Route>

      {/*// 仓库*/}
      <Route path="warehouse">
        <Route path="part">
          <Route path="list" component={WarehousePartList}/>
          <Route path="store" component={WarehousePartStore}/>
          <Route path="detail/:id" component={WarehousePartDetail}/>
        </Route>
        <Route path="category">
          <Route path="list" component={WarehouseCategoryList}/>
        </Route>
        <Route path="supplier">
          <Route path="list" component={WarehouseSupplierList}/>
        </Route>
        <Route path="part-entry-log">
          <Route path="list" component={WarehousePartEntryLogList}/>
        </Route>
      </Route>

      {/*// 项目*/}
      <Route path="maintain">
        <Route path="item" component={MaintainItemList}>
          {/*<Route path="category"/>*/}
        </Route>
      </Route>


      {/*// 财务*/}
      <Route path="finance">
        <Route path="expense">
          <Route path="list" component={FinanceExpenseList}/>
        </Route>
        <Route path="presales-income">
          <Route path="list" component={FinancePresalesIncomeList}/>
        </Route>
        <Route path="aftersales-income">
          <Route path="list" component={FinanceAfterSalesIncomeList}/>
        </Route>
        <Route path="aftersales-income-transfer">
          <Route path="list" component={FinanceAfterSalesIncomeTransferList}/>
        </Route>

        <Route path="income-statement-check">
          <Route path="sa" component={FinanceIncomeStatementCheck}/>
          <Route path="finance" component={FinanceIncomeStatementCheck}/>
        </Route>
      </Route>

      {/*// 人事*/}
      <Route path="personnel">
        <Route path="user">
          <Route path="list" component={PersonnelUserList}/>
          <Route path="detail" component={PersonnelUserDetail}/>
        </Route>
        <Route path="salary">
          <Route path="list" component={PersonnelSalaryList}/>
        </Route>
      </Route>

      {/*//营销*/}
      <Route path="marketing">
        {/*计次优惠*/}
        <Route path="timecount">
          <IndexRoute component={Timecount}/>
          <Route path="createTimecount" component={CreateTimecout}/>
        </Route>
        {/*折扣优惠*/}
        <Route path="discount" >
          <IndexRoute component={Discount}/>
          <Route path='createDiscount' components={CreateDiscount}/>
        </Route>
        {/*立减优惠*/}
        <Route path="minus">
          <IndexRoute component={Minus}/>
          <Route path='createMinus' component={CreateMinus}/>
        </Route>
        <Route path="membercardtype">
          {/*//会员卡列表*/}
          <Route path="list" component={MemberCardTypeList}/>
          {/*//会员卡编辑*/}
          <Route path="create" component={MemberCardTypeCreate}/>
          {/*//会员卡详情*/}
          <Route path="info" component={MemberCardTypeInfo}/>
        </Route>

        <Route path="membercard">
          <Route path="salelog" component={MemberCardSaleLog}/>
          <Route path="sale" component={MemberCardSale}/>
        </Route>

      </Route>


      {/*// 公司*/}
      <Route path="company">
        <Route path="list" component={CompanyList}/>
        <Route path="board" component={CompanyBoard}/>
      </Route>

      {/*// 广告*/}
      <Route path="advert">
        <Route path="list" component={AdvertList}/>
      </Route>

      {/*// 活动*/}
      <Route path="activity">
        <Route path="list" component={ActivityList}/>
      </Route>

      {/*// 评价*/}
      <Route path="comment">
        <Route path="list" component={CommentList}/>
      </Route>

      {/*// app*/}
      <Route path="app">
        <Route path="download" component={AppDownload}/>
      </Route>


      <Route path="maint-income-statement-check" component={FinanceIncomeStatementCheck}/>

      <Route path="register" component={Register}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>
), document.getElementById('app'));
