/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/15 0015.
 */
import {observable, action} from 'mobx'
import UserActFormatter from './user_action_formatter'

let companyStore = observable({
  loading: false,
  userAll: '',//[]
  onEditUser: {},
  editUserForm: '',
  editUserModalVisible: false,
  columnsUser: [
    { key: 'username', name: '用户名', locked: true, width: 150 },
    { key: 'device_count', name: '设备数量', minWidth: 100, width: 100 },
    { key: 'email', name: '邮箱', minWidth: 200, width: 200 },
    { key: 'phone', name: '联系方式', minWidth: 120, width: 120 },
    { key: 'address', name: '地址', minWidth: 300, width: 300 },
    { key: 'id', name: '操作', formatter: UserActFormatter, getRowMetaData: (row) => row, minWidth: 280, width: 280 },
  ],
  onAuthUser: {},
  onAuthDevice: [],
  notExcludeDevice: [],
  toAddDevice: [],
});
let thisStore = companyStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.setUserAll = action(array => {
  thisStore.userAll = array
})
thisStore.addUser = action(user => {
  thisStore.userAll = thisStore.userAll.push(user)
  // console.log(thisStore.userAll);
})
thisStore.deleteUser = action(id => {
  // thisStore.userAll.map(function (value,index) {
  //   console.log(value,index);
  // })
  // console.log(thisStore.userAll);
})
thisStore.setOnEditUser = action(user => {
  thisStore.onEditUser = user;
  if(user.id){
    thisStore.editUserModalVisible = true;
  }
})
thisStore.saveEditForm = action(form => {
  thisStore.editUserForm = form;
})
thisStore.setEditUserModalVisible = action(visible => {
  thisStore.editUserModalVisible = visible;
})
thisStore.setOnAuthUser = action(user => {
  thisStore.onAuthUser = user
})
thisStore.setOnAuthDevice = action(array => {
  thisStore.onAuthDevice = array
})
thisStore.setNotExcludeDevice = action(array => {
  thisStore.notExcludeDevice = array
})
thisStore.setToAddDevice = action(id => {
  const _index = thisStore.toAddDevice.indexOf(id);
  if(_index > -1){
    thisStore.toAddDevice.splice(_index,1);
  }else{
    thisStore.toAddDevice.push(id);
  }
})
thisStore.removeExcludeDevice = action(() => {
  const _toAddDevice = thisStore.toAddDevice;
  const _notExcludeDevice = thisStore.notExcludeDevice;
  const _onAuthDevice = thisStore.onAuthDevice;
  for(let i=_notExcludeDevice.length-1;i>-1;i--){
    if(_toAddDevice.indexOf(_notExcludeDevice[i].id) > -1){
      // console.log(i,'add:',_notExcludeDevice[i].mark)
      _onAuthDevice.push(_notExcludeDevice[i]);
      _notExcludeDevice.splice(i,1);
    }
  }
  thisStore.toAddDevice = [];
  thisStore.notExcludeDevice = _notExcludeDevice;
  thisStore.onAuthDevice = _onAuthDevice;
  // console.log(thisStore.notExcludeDevice.length,thisStore.onAuthDevice.length);
})
export default companyStore
