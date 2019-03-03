/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import {observable, action} from 'mobx'
import axios from 'axios'
import {Formatter, Api, Token, MessageHandle, httpConfig} from './../../common'
import TableRender from './table.render'
import {message} from 'antd'
import appStore from '../../store/app_store'

const {MSGActionRender, MSGContentRender, MSGTypeRender} = TableRender
const {ActivityIntensity, ActivityPercent} = Formatter
let accountStore = observable({
  loading: false,
  myInfo: [], //我的基本信息
  movebankName:'',//movebank用户名
  editMeModalVisible: false, //
  editMeForm: '',
  editMyPasswordModalVisible: false,
  editMyPasswordForm: '',
  movebankModalVisible:false,
  movebankForm:'',
  columnsBehavior: [
    {key: 'mark', name: 'SN', locked: true, width: 80},
    {key: 'uuid', name: 'UUID', locked: true, width: 210},
    {key: 'updated_at', name: '上传时间', minWidth: 200, width: 200},
    {key: 'timestamp', name: '采集时间', minWidth: 200, width: 200},
    {
      key: 'activity_expend',
      name: '活动时间',
      formatter: ActivityPercent,
      getRowMetaData: (row) => row,
      minWidth: 200,
      width: 130
    },
    {
      key: 'activity_intensity',
      name: '活动强度',
      formatter: ActivityIntensity,
      getRowMetaData: (row) => row,
      minWidth: 200,
      width: 200
    },
    {key: 'firmware_version', name: '固件', minWidth: 80, width: 80},
  ],
  message: [],
  messagePage: 1,
  messageTotalLength: 0,
  columnsMessage: [
    // antd-table
    {title: '消息类型', dataIndex: 'msg_type', key: 'msg_type', render: MSGTypeRender, width: 90},
    {title: '消息内容', dataIndex: 'msg_cn', render: MSGContentRender, key: 'msg_content'},
    {title: '操作', dataIndex: 'level', key: 'msg_action', render: MSGActionRender, width: 180},
    // react-data-grid
    // { key: 'msg_type', name: '消息类型', width: 90 },
    // { key: 'msg_cn', name: '消息内容',  },
    // { key: 'level', name: '操作', minWidth: 200, width: 200 },
  ]
})
const thisStore = accountStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.setMyInfo = action(array => {
  thisStore.myInfo = array
})
// 修改资料 - 显示弹窗
thisStore.setEditMeModalVisible = action(visible => {
  thisStore.editMeModalVisible = visible
})
// 修改资料 - 保存form表单
thisStore.setEditMeForm = action(form => {
  // console.log(form);
  thisStore.editMeForm = form;
})
// 修改资料 - 隐藏弹窗
thisStore.hideEditMeModal = action(() => {
  thisStore.editMeModalVisible = false;
})
// 修改资料 - 提交
thisStore.saveEditMeModal = action(() => {
  const form = thisStore.editMeForm;
  form.validateFields((err, values) => {
    if (err) {
      return;
    }
    const _data = {
      phone: values.phone,
      email: values.email,
      address: values.address,
    }
    axios.put(Api.updateMyInfo, _data, httpConfig()).then(res => {
      form.resetFields();
      const _myInfo = Object.assign(thisStore.myInfo, _data);
      thisStore.myInfo = _myInfo;
      thisStore.editMeModalVisible = false;
      appStore.getUser(Object.assign(appStore.user,_data))
    }).catch(err => {
      MessageHandle(err)
    })
    console.log('save...', values);
  })
})
// 修改密码 - 显示弹窗
thisStore.setEditMyPasswordModalVisible = action(visible => {
  thisStore.editMyPasswordModalVisible = visible
})
// 修改密码 - 保存form表单
thisStore.setEditMyPasswordForm = action(form => {
  // console.log(form);
  thisStore.editMyPasswordForm = form;
})
// 修改密码 - 隐藏弹窗
thisStore.hideEditMyPasswordModal = action(() => {
  thisStore.editMyPasswordModalVisible = false;
})
// 修改密码 - 提交
thisStore.saveEditMyPasswordModal = action(() => {
  const form = thisStore.editMyPasswordForm;
  form.validateFields((err, values) => {
    if (err) {
      return;
    }
    const _data = {
      old_password: Token.set(thisStore.myInfo.username, values.old_password),
      password: Token.set(thisStore.myInfo.username, values.password),
    }
    axios.put(Api.password(), _data, httpConfig()).then(res => {
      form.resetFields();
      message.success(appStore.language.user_password_changed())
      thisStore.editMyPasswordModalVisible = false;
      appStore.logOut()
    }).catch(err => {
      MessageHandle(err, 'password')
    })
    // console.log('save...', values);
  })
})
//MoveBank配置-显示模态框
thisStore.showMovebankModal=action(()=>{
  thisStore.movebankModalVisible = true;
})
//MoveBank配置-隐藏模态框
thisStore.hideMovebankModal=action(()=>{
  thisStore.movebankForm.resetFields()
  thisStore.movebankModalVisible = false;
})
//MoveBank配置-保存表单
thisStore.setMovebankForm= action(form => {
  thisStore.movebankForm = form;
})
//MoveBank配置-提交
thisStore.saveMovebankModal= action(() => {
  const form = thisStore.movebankForm;
  form.validateFields((err, values) => {
    if (err) {
      return;
    }
    const name = values.movebank_username;

    axios.put(Api.movebankUser(name), null,httpConfig()).then(res => {
      thisStore.movebankName=name;
      form.resetFields();
      message.success(appStore.language.pro_settings_updated)
      thisStore.movebankModalVisible = false;
    }).catch(err => {
      MessageHandle(err)
    })

  })
})


thisStore.checkPassword = action((rule, value, callback) => {
  const form = thisStore.editMyPasswordForm;
  if (value && value !== form.getFieldValue('password')) {
    callback(appStore.language.password_not_match);
  } else {
    callback();
  }
})
// 消息通知
thisStore.setMessage = action((array,totalLength) => {
  thisStore.message = array
  if(totalLength > -1){
    thisStore.messageTotalLength = totalLength
  }
})
export default accountStore