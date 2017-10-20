import React, { Component } from 'react';

import api from '../../../middleware/api';

require('../bargain-preview.less');
const backArrow = require('../../../images/preview_titlebar_back_arrow.png');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      introducePictures: [],
      bannerPicture: '',
      companyDetail: {},
    };

    [
      'assembleIntroducePics',
      'getBannerPic',
      'setProgressInfo',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.assembleIntroducePics();
    this.getBannerPic();
    this.getCompanyDetail();
  }

  componentWillReceiveProps(nextProps) {
    // 使用定时器可以更准确拿到this.props.state,否则前面setState后不触发此函数
    setTimeout(() => {
      this.assembleIntroducePics();
      this.getBannerPic();
      this.setProgressInfo(nextProps.detail);
    });
  }

  getCompanyDetail() {
    api.ajax({
      url: api.company.detail(),
    }, data => {
      const companyDetail = data.res.company;
      this.setState({ companyDetail });
    });
  }

  getRules(rule) {
    const rules = rule.split('\n');

    let span = '';
    for (const i in rules) {
      span += `<span/>${  rules[i]  }<br/>`;
    }
    return span;
  }

  getPicUrl(pic) {
    if (!pic) {
      return '';
    }
    return new Promise((resolve, reject) => {
      api.ajax({
        url: api.system.getPublicPicUrl(pic),
      }, data => {
        resolve(data.res.url);
      }, () => {
        reject('');
      });
    });
  }

  async assembleIntroducePics() {
    const formData = this.props.detail;
    const state = this.props.state;

    const introducePictures = [];
    const keys = formData.keys;

    for (let i = 0; i < keys.length; i++) {
      const deleteProp = `introduce_pics_hide_${i}`;
      const picKeyProp = `introduce_pics_${i}_key`;
      const picWord = formData[`introduce_word_${i}`];
      const file = state[`introduce_pics_${i}_files`];

      if (state[deleteProp]) {
        continue;
      }

      if (!!file && !!file[0]) {
        introducePictures.push({ url: file[0].preview, text: picWord });
      } else {
        const url = await this.getPicUrl(state[picKeyProp]);
        if (!!url) {
          introducePictures.push({ url, text: picWord });
        }
      }
    }

    this.setState({ introducePictures });
  }

  async getBannerPic() {
    const { state } = this.props;

    const banner_pic = this.props.detail.banner_pic;
    const file = state.banner_pic_files;

    if (!!file && !!file[0]) {
      if (!!banner_pic) {
        this.setState({ bannerPicture: file[0].preview });
        return true;
      }
    } else {
      if (!!banner_pic) {
        const url = await this.getPicUrl(banner_pic);
        this.setState({ bannerPicture: url });
        return true;
      }
    }
  }

  setProgressInfo(detail) {
    if (!!detail) {
      const sellPrice = detail.sell_price;
      const minPrice = detail.min_price;
      const currentPrice = detail.start_price;

      const totalDiff = Number(sellPrice) - Number(minPrice);
      const currentDiff = Number(currentPrice) - Number(minPrice);

      let rate = (currentDiff / totalDiff) || 0;

      if (Number(rate) >= 1) {
        rate = 1;
      } else if (Number(rate) < 0) {
        rate = 0;
      }

      const progressBarWidth = document.getElementsByClassName('progress-bar')[0].offsetWidth;

      let currentPriceWidth = progressBarWidth * rate * 0.98;

      if (currentPriceWidth < 9) {
        currentPriceWidth = 9;
      }
      const priceWordChangeWidth = progressBarWidth + 30 - 142;
      const currentPriceWordWidth = priceWordChangeWidth * rate;

      this.setState({ currentPriceWidth, currentPriceWordWidth: currentPriceWordWidth - 8 });
    }
  }

  render() {
    const { bannerPicture, introducePictures, companyDetail, currentPriceWidth, currentPriceWordWidth } = this.state;
    const { detail } = this.props;

    return (
      <div className="bargain-preview mb40">
        <div className="title-bar">
          <span className="return-back">
            <img src={backArrow} /> 返回
          </span>
          <span className="my-bargain">我的砍价</span>
        </div>
        {/* <!--上方带背景图部分-->*/}
        <div className="activity-info">
          <h3 className="title">{detail.title || '活动标题'}</h3>
          <p className="time">{`活动时间：${detail.start_date || 'xxxx-xx-xx'}至${detail.expire_date ||
          'xxxx-xx-xx'}`}</p>
          <div className="title-pic">
            {
              !!bannerPicture
                ? <img src={bannerPicture} alt="" />
                : <div className="pic-sample">项目图片</div>
            }
          </div>

          {/* <!--进度条-->*/}
          <div className="progress-bar">
            <div className="triangle-handstand" style={{ left: (currentPriceWidth - 9) || 0 }} />
            <span
              className="now-price-word"
              style={{ left: currentPriceWordWidth || -8 }}
            >
              现价 {Number(detail.start_price) || 'x'}元
            </span>

            <div className="original-price price" />
            <div className="now-price price" style={{ width: currentPriceWidth / 0.98 }} />
          </div>

          <div className="all-price">
            <p>底价{Number(detail.min_price) ? String(detail.min_price) : 'x'}元</p>
            <p>剩余{Number(detail.total_coupon_count) || 'x'}份</p>
            <p>原价{Number(detail.sell_price) || 'x'}元</p>
          </div>

          <div className="count-time">
            <p>参与活动即可享受优惠，快快行动吧！</p>
          </div>
        </div>

        {/* <!--中间参加 帮砍价按钮部分-->*/}
        <div className="active">
          <div className="button join">我要参加</div>
        </div>

        {/* <!--中间活动规则以及兑奖信息部分包括咨询电话-->*/}
        <div className="explain">
          <div className="rule explain-info">
            <div className="rule-word word">活动规则</div>
            <div dangerouslySetInnerHTML={{
              __html: detail.rule
                ? this.getRules(detail.rule)
                : '<p style="text-align: center; color: #999">暂无内容~</p>',
            }}>

            </div>
          </div>
          <div className="get-prize explain-info">
            <div className="prize-word word">兑奖信息</div>
            <p>【兑奖凭证】凭微信名或手机号到店内兑奖</p>
            <p>【活动时间】{detail.start_date} 至 {detail.expire_date}</p>
            <p>【兑奖门店】{companyDetail.name}</p>
            <p>
              【门店地址】
              {
                companyDetail.city === '市辖区'
                  ? `${companyDetail.province} ${companyDetail.country} ${companyDetail.address}`
                  : `${companyDetail.province} ${companyDetail.city} ${companyDetail.country} ${companyDetail.address}`
              }
            </p>
          </div>
          <a>咨询电话 {companyDetail.hotline_phone}</a>
        </div>

        {/* <!--项目介绍图片-->*/}
        <div className="project-introduction">
          <div className="gray-line" />

          <div className="title">
            <div className="line" />
            <div className="word">项目介绍</div>
          </div>

          <div className="introduce">
            {
              introducePictures.length > 0
                ? introducePictures.map((item, index) => (
                    <div className="pic" key={index}>
                      <img src={item.url} alt="" />
                      {
                        !!item.text ? <p>{item.text}</p> : null
                      }
                    </div>
                  ))
                : <p className="font-size-12 mt20" style={{
                  textAlign: 'center',
                  color: '#999',
                  height: '20px',
                  lineHeight: '20px',
                }}>暂无内容~</p>
            }
          </div>
          <div className="gray-line" />
        </div>

        {/* <!--下方砍价榜-->*/}
        <div className="bargain-list">
          <div className="title">
            <div className="line" />
            <div className="word">砍价榜</div>
          </div>

          <div className="tab-content">
            <a className="one tab" id="tab-one">帮砍榜</a>
            <div className="two tab" id="tab-two">排行榜</div>
          </div>
          <p>暂时没有砍价记录哦~</p>
        </div>
      </div>
    );
  }
}
