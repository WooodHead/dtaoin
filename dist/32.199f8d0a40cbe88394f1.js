(function(){"use strict";var e=this,t=this,a=function(e,a,r){t.Object.defineProperty(a,"__esModule",{value:!0});var n={aftersales:{project:{destroy:"aftersales/project/destroy"},consumptiveMaterial:{examine:"aftersales/consumptive-material/examine"}},warehouse:{purchase:{import:"warehouse/purchase/import",pay:"warehouse/purchase/pay"},purchaseReject:{export:"warehouse/purchase-reject/export",pay:"warehouse/purchase-reject/pay"},stocktaking:{auth:"warehouse/stocktaking/auth",authorize:"warehouse/stocktaking/authorize",import:"warehouse/stocktaking/import"},supplier:{pay:"warehouse/supplier/pay"}},customer:{information:"customer/customer-information",auto:"customer/auto-information",insurance:"customer/insurance-information",deal:"customer/deal-information",maintenance:"customer/maintenance-information",intention:"customer/intention-information",reminder:"customer/reminder"},deal:{calculatedReturn:"presales/deal-auto/calculation-income"},maintainItem:{commission:"maintain-item/commission"},marketing:{commission:"\tmarketing/membercard/commission"}};a.default=n},r=function(e,a,r){function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,a){if(!(e instanceof a))throw new t.TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,a){if(!e)throw new t.ReferenceError("this hasn't been initialised - super() hasn't been called");return!a||"object"!=typeof a&&"function"!=typeof a?e:a}function _inherits(e,a){if("function"!=typeof a&&null!==a)throw new t.TypeError("Super expression must either be null or a function, not "+typeof a);e.prototype=t.Object.create(a&&a.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),a&&(t.Object.setPrototypeOf?t.Object.setPrototypeOf(e,a):e.__proto__=a)}t.Object.defineProperty(a,"__esModule",{value:!0});var n=(r(48),r(47)),l=_interopRequireDefault(n),u=(r(50),r(49)),i=_interopRequireDefault(u),o=(r(68),r(67)),s=_interopRequireDefault(o),c=t.Object.assign||function(e){for(var a=1;a<arguments.length;a++){var r=arguments[a];for(var n in r)t.Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},f=function(){function defineProperties(e,a){for(var r=0;r<a.length;r++){var n=a[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),t.Object.defineProperty(e,n.key,n)}}return function(e,t,a){return t&&defineProperties(e.prototype,t),a&&defineProperties(e,a),e}}(),d=r(0),p=_interopRequireDefault(d),m=r(95),h=_interopRequireDefault(m),_=s.default.Item,y=function(e){function Help(e){_classCallCheck(this,Help);var a=_possibleConstructorReturn(this,(Help.__proto__||t.Object.getPrototypeOf(Help)).call(this,e));return a.state={},[].map(function(e){return a[e]=a[e].bind(a)}),a}return _inherits(Help,e),f(Help,[{key:"render",value:function(){var e=this.props.partInfo,a={};e&&(a=e.info);var r={display:"none"};e&&(r={position:"absolute",width:"850px",border:"1px solid rgba(16, 142, 233, 1)",paddingTop:"10px",left:e.coordinate.left+"px"||"",top:e.coordinate.top+10+"px"||"",display:e.visible?"":"none",backgroundColor:"white",zIndex:100,borderRadius:"6px"});var n=h.default.formItemLayout_1014;return p.default.createElement("div",{style:r},p.default.createElement(l.default,null,p.default.createElement(i.default,{span:6,offset:1},p.default.createElement(_,c({label:"配件名"},n),a.part_name||a.name)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"配件号"},n),a.part_no)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"规格"},n),a.spec||a.part_spec,a.unit||a.part_unit))),p.default.createElement(l.default,null,p.default.createElement(i.default,{span:6,offset:1},p.default.createElement(_,c({label:"品牌"},n),a.brand)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"适用车型"},n),a.scope)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"配件分类"},n),a.part_type_name))),p.default.createElement(l.default,null,p.default.createElement(i.default,{span:6,offset:1},p.default.createElement(_,c({label:"库存数"},n),a.remain_amount||a.part_amount||a.amount)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"冻结数"},n),a.freeze||a.part_freeze)),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"安全库存"},n),a.min_amount)),p.default.createElement(i.default,{span:5},p.default.createElement(_,c({label:"加价率"},n),a.markup_rate?100*t.Number(a.markup_rate)+"%":"0%"))),p.default.createElement(l.default,null,p.default.createElement(i.default,{span:6,offset:1},p.default.createElement(_,c({label:"当前进价"},n),t.Number(a.in_price).toFixed(2))),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"最低进价"},n),t.Number(a.min_in_price).toFixed(2))),p.default.createElement(i.default,{span:6},p.default.createElement(_,c({label:"当前售价"},n),t.Number(a.sell_price||a.material_fee_base).toFixed(2))),p.default.createElement(i.default,{span:5},p.default.createElement(_,c({label:"最低售价"},n),a.in_price?(a.in_price*(1+(t.Number(a.markup_rate)||0))).toFixed(2):""))))}}]),Help}(d.Component);a.default=y},n=function(e,a,r){function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _asyncToGenerator(e){return function(){var a=e.apply(this,arguments);return new t.Promise(function(e,r){function step(n,l){try{var u=a[n](l),i=u.value}catch(e){return void r(e)}if(!u.done)return t.Promise.resolve(i).then(function(e){step("next",e)},function(e){step("throw",e)});e(i)}return step("next")})}}function _classCallCheck(e,a){if(!(e instanceof a))throw new t.TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,a){if(!e)throw new t.ReferenceError("this hasn't been initialised - super() hasn't been called");return!a||"object"!=typeof a&&"function"!=typeof a?e:a}function _inherits(e,a){if("function"!=typeof a&&null!==a)throw new t.TypeError("Super expression must either be null or a function, not "+typeof a);e.prototype=t.Object.create(a&&a.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),a&&(t.Object.setPrototypeOf?t.Object.setPrototypeOf(e,a):e.__proto__=a)}t.Object.defineProperty(a,"__esModule",{value:!0});var n=(r(311),r(310)),l=_interopRequireDefault(n),u=(r(48),r(47)),i=_interopRequireDefault(u),o=(r(50),r(49)),s=_interopRequireDefault(o),c=(r(37),r(59)),f=_interopRequireDefault(c),d=(r(157),r(35)),p=_interopRequireDefault(d),m=(r(46),r(40)),h=_interopRequireDefault(m),_=(r(66),r(65)),y=_interopRequireDefault(_),b=(r(158),r(130)),E=_interopRequireDefault(b),v=(r(68),r(67)),P=_interopRequireDefault(v),g=t.Object.assign||function(e){for(var a=1;a<arguments.length;a++){var r=arguments[a];for(var n in r)t.Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},w=function(){function defineProperties(e,a){for(var r=0;r<a.length;r++){var n=a[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),t.Object.defineProperty(e,n.key,n)}}return function(e,t,a){return t&&defineProperties(e.prototype,t),a&&defineProperties(e,a),e}}(),k=r(0),x=_interopRequireDefault(k),D=r(634),R=_interopRequireDefault(D),O=r(312),j=_interopRequireDefault(O),C=r(22),N=_interopRequireDefault(C),I=r(1605),q=_interopRequireDefault(I),S=r(95),F=_interopRequireDefault(S),M=P.default.Item,T=E.default.Option,z=function(e){function AuthPay(e){_classCallCheck(this,AuthPay);var a=_possibleConstructorReturn(this,(AuthPay.__proto__||t.Object.getPrototypeOf(AuthPay)).call(this,e));return a.state={visible:!1,hasPermission:!1,detail:e.detail||{},unPayWorth:t.parseFloat(e.detail.unpay_worth)},a.handleShow=a.handleShow.bind(a),a.handleCancel=a.handleCancel.bind(a),a.handlePay=a.handlePay.bind(a),a}return _inherits(AuthPay,e),w(AuthPay,[{key:"componentWillUnmount",value:function(){t.clearInterval(this.interval)}},{key:"handleShow",value:function(){var e=this.props.detail;if("1"!==t.String(e.status))return void y.default.error("请先入库采购单，再结算");this.setState({detail:e,unPayWorth:t.parseFloat(e.unpay_worth)}),this.checkPermission(q.default.warehouse.purchase.pay),this.showModal()}},{key:"handleCancel",value:function(){t.clearInterval(this.interval),this.hideModal()}},{key:"handlePay",value:function(e){e.preventDefault();var a=this.props.form.getFieldsValue();if(a.pay_worth>this.state.detail.unpay_worth)return y.default.warn("请检查输入金额"),!1;a.purchase_id=this.props.id,N.default.ajax({url:N.default.warehouse.purchase.pay(),type:"post",data:a},function(){y.default.success("支付成功"),t.setTimeout(function(){t.location.href="/warehouse/purchase/index"},500)},function(e){y.default.error(e)})}},{key:"checkPermission",value:function(){function checkPermission(t){return e.apply(this,arguments)}var e=_asyncToGenerator(t.regeneratorRuntime.mark(function _callee(e){var a;return t.regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,N.default.checkPermission(e);case 2:a=r.sent,a?this.getPurchaseDetail(this.props.id):this.interval=t.setInterval(this.getPurchaseDetail.bind(this,this.props.id),2e3),this.setState({hasPermission:a});case 5:case"end":return r.stop()}},_callee,this)}));return checkPermission}()},{key:"getPurchaseDetail",value:function(e){var a=this;N.default.ajax({url:N.default.warehouse.purchase.detail(e)},function(e){var r=e.res.detail;a.setState({detail:r});var n=t.String(r.pay_status);("2"===n||"1"===n&&t.parseFloat(r.unpay_worth)!==a.state.unPayWorth)&&(y.default.success("支付成功"),t.clearInterval(a.interval),t.location.href="/warehouse/purchase/index")})}},{key:"render",value:function(){var e=F.default.formItemTwo,a=F.default.selectStyle,r=this.state,n=r.visible,u=r.hasPermission,o=r.detail,c=r.unPayWorth,d=this.props,m=d.id,_=d.disabled,y=d.form,b=d.size,v=y.getFieldDecorator,w=y.getFieldValue,k=t.String(o.pay_status);return x.default.createElement("span",null,"small"===b?x.default.createElement("a",{href:"javascript:;",onClick:this.handleShow},"结算"):x.default.createElement(h.default,{type:"primary",onClick:this.handleShow,disabled:_},"结算"),x.default.createElement(l.default,{title:x.default.createElement("span",null,x.default.createElement(p.default,{type:"eye"})," 采购单结算"),visible:n,maskClosable:!1,onCancel:this.handleCancel,footer:u?x.default.createElement("span",null,x.default.createElement(h.default,{size:"large",className:"mr5",onClick:this.handleCancel},"取消"),x.default.createElement(h.default,{size:"large",type:"primary",onClick:this.handlePay},"结算")):null},x.default.createElement(i.default,{type:"flex",align:"middle"},x.default.createElement(s.default,{span:12},x.default.createElement(P.default,null,x.default.createElement(M,g({label:"供应商"},e),x.default.createElement("p",null,o.supplier_company)),x.default.createElement(M,g({label:"应付金额"},e),x.default.createElement("p",null,o.unpay_worth,"元")),x.default.createElement(M,g({label:"实付金额"},e),v("pay_worth")(x.default.createElement(f.default,{type:"number",addonAfter:"元",placeholder:"填写实付金额"}))),x.default.createElement(M,g({label:"支付方式"},e),v("pay_type",{initialValue:"2"})(x.default.createElement(E.default,a,x.default.createElement(T,{key:"1"},"银行转账"),x.default.createElement(T,{key:"2"},"现金支付")))))),x.default.createElement(s.default,{span:12,className:u?"hide":null},x.default.createElement("div",{className:w("pay_worth")?"center":"hide"},x.default.createElement(R.default,{value:t.JSON.stringify({authType:"purchase_pay",requestParams:{type:"post",url:N.default.warehouse.purchase.pay(),data:{purchase_id:m,pay_worth:w("pay_worth"),pay_type:w("pay_type")}}}),size:128,ref:"qrCode"}),x.default.createElement("p",null,"请扫码确认支付"),x.default.createElement("p",null,x.default.createElement(p.default,{type:"check-circle",className:"2"===k||"1"===k&&t.parseFloat(o.unpay_worth)!==c?"confirm-check":"hide"})))))))}}]),AuthPay}(j.default);z.defaultProps={size:"default"},z=P.default.create()(z),a.default=z},l=function(e,a,r){function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,a){if(!(e instanceof a))throw new t.TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,a){if(!e)throw new t.ReferenceError("this hasn't been initialised - super() hasn't been called");return!a||"object"!=typeof a&&"function"!=typeof a?e:a}function _inherits(e,a){if("function"!=typeof a&&null!==a)throw new t.TypeError("Super expression must either be null or a function, not "+typeof a);e.prototype=t.Object.create(a&&a.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),a&&(t.Object.setPrototypeOf?t.Object.setPrototypeOf(e,a):e.__proto__=a)}t.Object.defineProperty(a,"__esModule",{value:!0});var n=(r(50),r(49)),l=_interopRequireDefault(n),u=(r(48),r(47)),i=_interopRequireDefault(u),o=(r(68),r(67)),s=_interopRequireDefault(o),c=t.Object.assign||function(e){for(var a=1;a<arguments.length;a++){var r=arguments[a];for(var n in r)t.Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},f=function(){function defineProperties(e,a){for(var r=0;r<a.length;r++){var n=a[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),t.Object.defineProperty(e,n.key,n)}}return function(e,t,a){return t&&defineProperties(e.prototype,t),a&&defineProperties(e,a),e}}(),d=r(0),p=_interopRequireDefault(d),m=r(132),h=r(95),_=_interopRequireDefault(h),y=r(22),b=_interopRequireDefault(y),E=r(198),v=_interopRequireDefault(E),P=r(1735),g=_interopRequireDefault(P),w=r(1790),k=_interopRequireDefault(w),x=s.default.Item,D=function(e){function Detail(e){_classCallCheck(this,Detail);var a=_possibleConstructorReturn(this,(Detail.__proto__||t.Object.getPrototypeOf(Detail)).call(this,e));return a.state={id:e.match.params.id||"",page:1,detail:{},list:[],enterPartInfo:""},["handlePartEnter","handlePartLeave","handlePageChange"].map(function(e){return a[e]=a[e].bind(a)}),a}return _inherits(Detail,e),f(Detail,[{key:"componentDidMount",value:function(){var e=this.state,t=e.id,a=e.page;this.getPurchaseDetail(t),this.getPurchaseItems(t,a)}},{key:"handlePageChange",value:function(e){this.setState({page:e}),this.getPurchaseItems(this.state.id,e)}},{key:"handlePartEnter",value:function(e,t){var a={};a.coordinate=b.default.getOffsetParentPosition(e),a.info=t,a.visible=!0,this.setState({enterPartInfo:a})}},{key:"handlePartLeave",value:function(e,t){var a={};a.coordinate=b.default.getOffsetParentPosition(e),a.info=t,a.visible=!1,this.setState({enterPartInfo:a})}},{key:"getPurchaseDetail",value:function(e){var t=this;b.default.ajax({url:b.default.warehouse.purchase.detail(e)},function(e){var a=e.res.detail;t.setState({detail:a})})}},{key:"getPurchaseItems",value:function(e,a){var r=this;b.default.ajax({url:b.default.warehouse.purchase.items(e,a)},function(e){var a=e.res,n=a.list,l=a.total;r.setState({list:n,total:t.parseInt(l)})})}},{key:"render",value:function(){var e=this,a=_.default.formItemThree,r=_.default.formItem12,n=this.state,u=n.detail,o=n.page,f=n.list,d=n.total,h=n.enterPartInfo,y=0,b=0,E=t.JSON.parse(t.JSON.stringify(f));E.map(function(e){y+=t.Number(e.amount),b+=t.Number(e.in_price)*t.Number(e.amount)}),E.length>0&&E.push({_id:"合计",amount:y,amount_price:t.Number(b).toFixed(2)});var P=function(e,a,r){var n={children:e,props:{}};return t.Number(r)===t.Number(E.length-1)&&(n.props.colSpan=0),n},w=[{title:"序号",dataIndex:"_id",key:"index",render:function(e,a,r){return t.Number(r)===t.Number(E.length-1)?{children:"合计",props:{colSpan:7}}:r+1}},{title:"配件名",dataIndex:"part_name",key:"part_name",render:function(a,r,n){return t.Number(n)===t.Number(E.length-1)?{children:a,props:{colSpan:0}}:p.default.createElement(m.Link,{to:{pathname:"/warehouse/part/detail/"+r.part_id},onMouseEnter:function(t){return e.handlePartEnter(t,r)},onMouseLeave:function(t){return e.handlePartLeave(t,r)}},a)}},{title:"配件号",dataIndex:"part_no",key:"part_no",render:P},{title:"规格",dataIndex:"spec",key:"spec",render:function(e,a,r){return t.Number(r)===t.Number(E.length-1)?{children:e,props:{colSpan:0}}:e+a.unit}},{title:"品牌",dataIndex:"brand",key:"brand",render:P},{title:"适用车型",dataIndex:"scope",key:"scope",render:P},{title:"配件分类",dataIndex:"part_type_name",key:"part_type_name",render:P},{title:"采购数量",dataIndex:"amount",key:"amount",render:function(e,a,r){return t.Number(r)===t.Number(E.length-1)?{children:e,props:{colSpan:4}}:e}},{title:"库存数量",dataIndex:"remain_amount",key:"remain_amount",render:P},{title:"本次采购单价(元)",dataIndex:"in_price",key:"in_price",className:"text-right",render:P},{title:"历史最低进价(元)",dataIndex:"min_in_price",key:"min_in_price",className:"text-right",render:P},{title:"金额(元)",dataIndex:"amount_price",key:"total_fee",className:"text-right",render:function(e,a,r){return t.Number(r)===t.Number(E.length-1)?{children:e,props:{colSpan:1}}:t.Number(a.in_price*a.amount).toFixed(2)}}];return p.default.createElement("div",null,p.default.createElement(g.default,{partInfo:h}),p.default.createElement(i.default,{className:"clearfix"},p.default.createElement("h4",{className:"mb10 pull-left"},"基本信息"),p.default.createElement("div",{className:"pull-right"},0===t.Object.keys(u).length||"-1"===t.String(u.status)||"2"===t.String(u.pay_status)?null:p.default.createElement("div",{className:"pull-right"},p.default.createElement(k.default,{id:u._id,detail:u})))),p.default.createElement(i.default,null,p.default.createElement(l.default,{span:16},p.default.createElement(s.default,null,p.default.createElement(i.default,{className:"0"===t.String(u.intention_id)?"hide":null},p.default.createElement(l.default,{span:16},p.default.createElement(x,c({label:"工单号"},r),p.default.createElement(m.Link,{to:{pathname:"/aftersales/project/new/"+u.intention_id}},u.intention_id)))),p.default.createElement(i.default,null,p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"供应商"},a),p.default.createElement("p",null,u.supplier_company))),p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"采购金额"},a),p.default.createElement("p",null,u.worth," 元"))),p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"实付金额"},a),p.default.createElement("p",null,u.worth&&u.unpay_worth?t.Number(t.parseFloat(u.worth)-t.parseFloat(u.unpay_worth)).toFixed(2):"0.00","元")))),p.default.createElement(i.default,null,p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"采购类型"},a),p.default.createElement("p",null,u.type_name))),p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"运费"},a),p.default.createElement("p",null,u.freight," 元"))),p.default.createElement(l.default,{span:8},p.default.createElement(x,c({label:"物流公司"},a),p.default.createElement("p",null,u.logistics)))),p.default.createElement(i.default,null,p.default.createElement(l.default,{span:16},p.default.createElement(x,c({label:"备注"},r),p.default.createElement("p",null,u.remark))))))),p.default.createElement("h4",{className:"mb10"},"配件列表"),p.default.createElement(v.default,{columns:w,dataSource:E,total:d,currentPage:o,onPageChange:this.handlePageChange}))}}]),Detail}(p.default.Component);a.default=D},u=e,i=u.webpackJsonp;if(u.webpackJsonp!==i)throw new Error("Prepack model invariant violation: "+u.webpackJsonp);var o=[32],s={1605:a,1735:r,1790:n,670:l};i(o,s)}).call(this);