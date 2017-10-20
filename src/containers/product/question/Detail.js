import React from 'react';
import className from 'classnames';
import { message, Button, Popconfirm } from 'antd';

import api from '../../../middleware/api';

import BigImagePreview from '../../../components/widget/BigImagePreview';

import Shield from './Shield';
import Profile from './Profile';
import Image from './Image';

require('../question.less');

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      detail: {},
      dialogs: [],
      dialogItems: [],
      currentDialog: {},
      artificer: {},
      fromUserAvatarType: '',
      targetUserAvatarType: '',
    };

    this.handleAdoptAnswer = this.handleAdoptAnswer.bind(this);
    this.getDetail = this.getDetail.bind(this);
  }

  componentDidMount() {
    const { id } = this.state;
    this.getDetail(id);
    this.getDialogs(id);
  }

  handleAdoptAnswer() {
    const { id } = this.state;
    api.ajax({
      url: api.question.adoptAllAnswer(),
      data: {
        question_ids: id,
      },
      type: 'POST',
    }, () => {
      message.success('平分成功');
      location.reload();
    }, err => {
      message.error(`平分失败[${err}]`);
    });
  }

  handleDialogSelect(dialog) {
    this.getDialogItems(this.state.id, dialog);
    this.getArtificer(dialog.artificer_id);
  }

  handleShieldDialog(questionId, dialogId) {
    api.ajax({
      url: api.question.shieldDialog(),
      type: 'post',
      data: {
        question_id: questionId,
        dialog_id: dialogId,
      },
    }, () => {
      message.success('对话屏蔽成功');
      this.getDialogs(this.state.id);
    }, err => {
      message.error(`对话屏蔽失败[${err}]`);
    });
  }

  setUserAvatarType(dialogItems) {
    dialogItems.forEach(item => {
      if (item.type !== '1' && item.from_avatar_pic) {
        this.setState({ targetUserAvatarType: item.from_avatar_pic });
        return false;
      }
    });
  }

  getDetail(id) {
    const questionId = id || this.state.id;
    api.ajax({ url: api.question.detail(questionId) }, data => {
      this.setState({ detail: data.res.detail });
    });
  }

  getDialogs(questionId) {
    api.ajax({ url: api.question.dialogList(questionId) }, data => {
      this.setState({ dialogs: data.res.list });
    });
  }

  getDialogItems(questionId, dialog) {
    api.ajax({ url: api.question.dialogItemList(questionId, dialog._id) }, data => {
      const { list } = data.res;

      this.setUserAvatarType(list);
      this.setState({
        dialogItems: list,
        currentDialog: dialog,
      });
    });
  }

  getArtificer(artificerId) {
    api.ajax({ url: api.technician.detail(artificerId) }, data => {
      this.setState({ artificer: data.res.detail });
    });
  }

  render() {
    const {
      detail,
      dialogs,
      dialogItems,
      currentDialog,
      artificer,
      targetUserAvatarType,
    } = this.state;

    return (
      <div>
        <div className="section-header">
          <h3>问题详情</h3>
          <div>
            <Popconfirm
              placement="topRight"
              title="你确定要平分收益吗？"
              onConfirm={this.handleAdoptAnswer}
            >
              <Button className="mr10" disabled={detail.is_balance === '1'}>平分收益</Button>
            </Popconfirm>
            <Shield
              id={detail._id}
              shape="button"
              disabled={detail.status === '-1'}
              handleSuccess={this.getDetail}
            />
          </div>
        </div>

        <div className="question-info">
          <div className="avatar">
            <img src={require('../../../images/home/icon1.png')} alt="无头像"
                 style={{ width: 30, height: 30 }} />
          </div>

          <div className="question-desc">
            <p className="text-gray">
              <span>{detail.questioner_name}</span>
              <span className="ml20">{detail.ctime}</span>
              <span className="ml20">{detail.questioner_company_name}</span>
            </p>
            <p>
              <label className="label">问题描述</label>
              <span>{detail.content}</span>
            </p>
            <p>
              <label className="label">车型</label>
              <span>{detail.auto_brand_name} {detail.auto_series_name}</span>
            </p>
            <p>
              <label className="label">问题类型</label>
              <span>{detail.type_name}</span>
            </p>
          </div>
        </div>

        <div className="dialog-container">
          <p className="header">共{detail.dialog_count}人回答，{detail.dialog_item_count}条回复</p>

          <div className="dialog">
            <ul className="dialog-list">
              {dialogs.map(dialog => {
                const dialogItem = className({
                  'dialog-item': true,
                  active: dialog._id === currentDialog._id,
                  delete: dialog.status === '-1',
                });

                return (
                  <li className={dialogItem} key={dialog._id}
                      onClick={this.handleDialogSelect.bind(this, dialog)}>
                    <Image fileType={dialog.artificer_avatar_pic} />

                    <div className="dialog-item-content">
                      <p className="text-gray">{dialog.artificer_name} </p>
                      <p capture="text-gray">{dialog.mtime}</p>
                      <p>{!!dialog.last_message && JSON.parse(dialog.last_message).text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="dialog-view">
              <div className="dialog-view-header">
                <h3>{currentDialog.artificer_name ? `${currentDialog.artificer_name}的回答` : ''}</h3>

                <div className="dialog-view-header-extra">
                  {Object.keys(currentDialog).length > 0 && currentDialog.status !== '-1' && (
                    <Popconfirm
                      placement="topRight"
                      title="你确定要屏蔽该对话吗？"
                      onConfirm={this.handleShieldDialog.bind(this, detail._id, currentDialog._id)}
                    >
                      <a href="javascript:">屏蔽</a>
                    </Popconfirm>
                  )}
                </div>
              </div>

              <div className="dialog-view-content">
                {dialogItems.map(item => (
                    <div className={item.type === '1' ? 'dialog-item left' : 'dialog-item right'}
                         key={item._id}>
                      {item.type === '1' ? <Profile artificer={artificer} item={item} /> :
                        <Image fileType={item.from_avatar_pic} />
                      }

                      <div className="dialog-msg-container">
                        <div className="dialog-msg-box">
                          {item.msg_type === '1' ?
                            <span>{!!item.content && JSON.parse(item.content).text}</span> :
                            <BigImagePreview
                              fileType={!!item.content && JSON.parse(item.content).file_name} />
                          }
                        </div>
                        <p>{item.mtime}</p>
                      </div>
                    </div>
                  ))}

                {currentDialog.is_adopt === '1' && (
                  <div className="dialog-item right is-adopt">
                    <Image fileType={targetUserAvatarType} />
                    <div className="dialog-msg-box">
                      <p>用户采纳了答案</p>
                    </div>
                  </div>
                )}

                {currentDialog.status === '-1' && (
                  <div className="dialog-item center">
                    <div className="dialog-item-msg">该对话已关闭</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
