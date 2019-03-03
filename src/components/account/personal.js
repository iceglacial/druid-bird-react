/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import thisStore from './store'
import {Card, Button, Row, Col, Icon, message, Spin, Avatar} from 'antd'
import MyInfoModal from './myinfo.modal'
import MyPasswordModal from './mypassword.modal'
import MyProfileForm from './myprofile.form'
import appStore from '../../store/app_store'
import MovebankModal from './movebank.modal'
import LoadingImg from '../../common/loadingImg'
// import UserFields from './user_fields/tabs'

// import Test from './user_fields/data-table-cell-reorder'

@observer
class MySetting extends React.Component {
  constructor() {
    super()
    this.getMyInfo()
    this.getMovebankInfo();
    this.newMovebankName=this.newMovebankName.bind(this);
  }

  getMyInfo = () => {
    thisStore.set('loading',true)
    axios.get(Api.me, httpConfig()).then(res => {
      thisStore.setMyInfo(res.data);
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    });
  }

  getMovebankInfo=()=>{
    axios.get(Api.company, httpConfig()).then(res => {
      thisStore.movebankName=res.data.move_bank_user;
    }).catch(err => {
      MessageHandle(err)
    })
  }

  newMovebankName=()=>{
    thisStore.showMovebankModal();
  }

  modifyMovebankName=()=>{
    thisStore.showMovebankModal();

  }

  saveMyProfile = () => {
    thisStore.set('loading',true)
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const _data = {
        // language: parseInt(values.language),
        page_size: parseInt(values.page_size),
        time_zone: parseInt(values.time_zone),
      };
      // console.log(values,_data)
      axios.put(Api.profile, _data, httpConfig()).then(res => {
        // thisStore.setEditMyPasswordModalVisible(false);
        // appStore.setLang(values.language);
        appStore.setTimeZone(values.time_zone);
        appStore.setPageSize(values.page_size);
        message.success(appStore.language.pro_settings_updated)
        thisStore.set('loading',false)
      }).catch(err => {
        MessageHandle(err)
        thisStore.set('loading',false)
      })
    })
  }

  setProfileForm = (form)=>{
    this.form = form
  }

  render() {
    return (
      <div className="wrap">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <Row>
            <Col lg={6} sm={12}>
              <Card title={appStore.language.person_info} className="card-panel has-header">
                <div className="ant-card-inner">
                  <div className="user-head">
                    <Avatar size="large" className="bigger" icon="person"/>
                    {/*<Icon type="person"/>*/}
                  </div>
                  <div className="user-info wrap">
                    <div className="title">{thisStore.myInfo.username}</div>
                    <div className="item item-has-icon"><Icon type="email"/>{thisStore.myInfo.email || '-'}</div>
                    <div className="item item-has-icon"><Icon type="phone"/>{thisStore.myInfo.phone || '-'}</div>
                    <div className="item item-has-icon"><Icon type="marker"/>{thisStore.myInfo.address || '-'}</div>
                    <div className="item item-has-icon"><Icon type="eye"/>{appStore.language.getRole(thisStore.myInfo.role) || '-'}</div>
                    <div className="item item-has-icon"><Icon type="company"/>{thisStore.myInfo.company_name || '-'}
                    </div>
                  </div>
                </div>
                <div className="ant-card-foot">
                  <Button.Group size="large">
                    <Button
                      onClick={() => thisStore.setEditMeModalVisible(true)}>{appStore.language.edit_profile}</Button>
                    <Button
                      onClick={() => thisStore.setEditMyPasswordModalVisible(true)}>{appStore.language.edit_password}</Button>
                  </Button.Group>
                </div>
              </Card>
            </Col>
            <Col lg={6} sm={12}>
              <Card title={appStore.language.pro_settings} className="card-panel has-header">
                <MyProfileForm saveMyProfile={this.saveMyProfile} ref={this.setProfileForm}/>
              </Card>
              {appStore.user.role === 'admin'?<Card title="MoveBank" className="card-panel has-header" id="movebank">
                <div>
                  <div className="username">{appStore.language.username} : {(thisStore.movebankName||<a onClick={this.newMovebankName} className="alink">{appStore.language.click_to_set}</a>)}</div>
                  {thisStore.movebankName &&
                  <i onClick={this.modifyMovebankName} className="anticon anticon-edit modifyBtn"/>}
                  <span className="notice">{appStore.language.movebank_daily_notice}</span>
                </div>
              </Card>:''}
            </Col>
            {/*<Col lg={12} sm={24}>*/}
              {/*<Card>*/}
                {/*<UserFields/>*/}
              {/*</Card>*/}
            {/*</Col>*/}
          </Row>
          {/*<Test></Test>*/}
        </Spin>
        <MyInfoModal visible={thisStore.editMeModalVisible}
                     onCancel={thisStore.hideEditMeModal}
                     onCreate={thisStore.saveEditMeModal}
        />
        <MyPasswordModal visible={thisStore.editMyPasswordModalVisible}
                         onCancel={thisStore.hideEditMyPasswordModal}
                         onCreate={thisStore.saveEditMyPasswordModal}
        />
        <MovebankModal visible={thisStore.movebankModalVisible}
                       onCancel={thisStore.hideMovevbankModal}
                       onCreate={thisStore.saveMovebankModal}
        />
      </div>
    )
  }
}
export default MySetting