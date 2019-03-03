/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {observer} from 'mobx-react'
import ReactDataGrid from 'react-data-grid'
import {message,Pagination,Modal,Spin} from 'antd'
import axios from 'axios'
import {Api, Token, MessageHandle, DataFormatter, httpConfig} from '../../common'
import UserEditModal from './user.edit.form'
import thisStore from './store'
import EmptyRowsView from './empty_rows_show'
import CompanyUserHead from './user.list.head'
import appStore from '../../store/app_store'
import UserActFormatter from './user_action_formatter'
import LoadingImg from '../../common/loadingImg'

const {UserDataFormatter} = DataFormatter
@observer
class AppCompanyUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userArray: [],
      modalUserVisible: false,
      user: {},
      currentPage: 1,
      totalLength: 0,
    }
    this.loadPage()
  }

  //修改用户信息
  saveModalUser = () => {
    const form = thisStore.editUserForm;
    const user = thisStore.onEditUser;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data = {
        old_password: Token.set(appStore.user.username, values.old_password),
        password: Token.set(user.username, values.password)
      };
      axios.put(Api.password(user.id), data, httpConfig()).then(res => {
        form.resetFields();//清空表单内容
        message.success(appStore.language.user_password_changed(user));
        thisStore.setEditUserModalVisible(false);
      }).catch(err => {
        MessageHandle(err, 'password');
      })
      // const data = {
      //   email: values.email,
      //   phone: values.phone,
      //   address: values.address
      // };
      // axios.put(Api.updateUser,data,config).then(res=>{
      //   message.success(`用户信息修改成功！`);
      //   form.resetFields();//清空表单内容
      //   thisStore.setEditUserModalVisible(false);
      // }).catch(err=>{
      //   MessageHandle(err);
      // })
    })
  }
  handleUserCancel = () => {
    thisStore.setEditUserModalVisible(false);
    this.setState({
      confirmLoading: false
    })
  }

  rowGetter(i) {
    return thisStore.userAll[i];
  }

  onChangePage = (page) => {
    // console.log(page)
    this.loadPage(page)
  }
  onShowSizeChange = (current, pagesize) => {
    // console.log(current,pagesize)
    appStore.setPageSize(pagesize)
    this.loadPage()
  }
  loadPage = (p) => {
    thisStore.set('loading',true)
    let page = p || 1
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    axios.get(Api.companyUser, httpConfig('-updated_at', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      let companyUser = UserDataFormatter(res.data)
      this.setState({
        currentPage: page,
        messages: res.data,
        totalLength: totalLength,
        userArray: companyUser
      })
      thisStore.setUserAll(companyUser);
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }
  resizeGrid=()=>{
    // console.log('reload grid')
    this.refs.grid && this.refs.grid.updateMetrics();
    // appStore.setReloadGrid(false)
  }
  render() {
    if(appStore.reloadGrid){
      setTimeout(this.resizeGrid,200)
    }
    const columnsUser = [
      {key: 'username', name: `${appStore.language.getKeyName('username')}`, locked: true, width: 150},
      {key: 'device_count', name: `${appStore.language.device_count}`, locked: true, width: 100},
      {key: 'email', name: `${appStore.language.getKeyName('email')}`},
      {key: 'phone', name: `${appStore.language.getKeyName('phone')}`},
      {key: 'address', name: `${appStore.language.getKeyName('address')}`},
      {
        key: 'id',
        name: `${appStore.language.operate}`,
        formatter: UserActFormatter,
        getRowMetaData: (row) => row,
        width: 280
      },
    ]
    return (
      <div className="wrap wrap-full">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <div className="flex-box wrap-full">
            <CompanyUserHead />
            <div className="wrap-full">
                {this.rowGetter(0)?
                    <ReactDataGrid
                        rowKey="id"
                        ref="grid"
                        columns={columnsUser}
                        rowGetter={this.rowGetter}
                        rowHeight={45}
                        minColumnWidth={200}
                        rowsCount={thisStore.userAll.length}
                        minHeight={800}
                        emptyRowsView={EmptyRowsView}
                    />
                :""}

            </div>
            <div className="wrap text-right">
              <Pagination current={this.state.currentPage} showQuickJumper
                          showTotal={total => appStore.language.total_count(total)}
                          onChange={this.onChangePage}
                          total={this.state.totalLength}//accountStore.messageTotalLength
                          pageSize={appStore.pageSize}
                          onShowSizeChange={this.onShowSizeChange}
                          pageSizeOptions={[...appStore.pageSizeOptions.map(size => (size + ''))]}
                          showSizeChanger
                          bordered
              />
            </div>
          </div>
        </Spin>
        <Modal
          visible={thisStore.editUserModalVisible}
          title={appStore.language.edit_user}
          onCancel={this.handleUserCancel}
          onOk={this.saveModalUser}
          wrapClassName="vertical-center-modal"
          maskClosable={false}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          key={Math.random()}
          width={600}
        >
          <UserEditModal ref={thisStore.saveEditForm}/>
        </Modal>
        {/*<UserEditModal ref={thisStore.saveEditForm}*/}
                       {/*visible={thisStore.editUserModalVisible}*/}
                       {/*onCancel={this.handleUserCancel}*/}
                       {/*onCreate={this.saveModalUser}*/}
        {/*/>*/}
      </div>
    )
  }
}
export default AppCompanyUser