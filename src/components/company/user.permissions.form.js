/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/21 0021.
 */
import React from 'react'
import {Form, message, Card, Row, Col, Switch, Spin} from 'antd'
import {observer} from 'mobx-react'
import {Api, httpConfig, MessageHandle} from '../../common'
import axios from 'axios'
import thisStore from './store'
import appStore from '../../store/app_store'

@observer
class UserPermissions extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const _permissions = thisStore.onAuthUser.permissions || {};
    const userPermissions = {
      export_auth: !!_permissions.export_auth,
      analysis_auth: !!_permissions.analysis_auth,
      env_auth: !!_permissions.env_auth,
      bhv_auth: !!_permissions.bhv_auth,
      biological_auth_view: (_permissions.biological_auth === 1) || (_permissions.biological_auth === 3),
      biological_auth_edit: (_permissions.biological_auth === 2) || (_permissions.biological_auth === 3),
      user_auth_view: (_permissions.user_auth === 1) || (_permissions.user_auth === 3),
      user_auth_edit: (_permissions.user_auth === 2) || (_permissions.user_auth === 3),
      setting_auth_view: (_permissions.setting_auth === 1) || (_permissions.setting_auth === 3),
      setting_auth_edit: (_permissions.setting_auth === 2) || (_permissions.setting_auth === 3),
    };
    return (
      <Form>
        <Card className="card-panel" bordered={false}>
          <Row className='item-inline head'>
            <Col span={18}>{appStore.language.permission}</Col>
            <Col span={6} className='text-center'>{appStore.language.view}</Col>
          </Row>
          <Row className='item-inline'>
            <Col span={18}>{appStore.language.data_export}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('export_auth', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.export_auth,
              })(
                <Switch/>
              )}
            </Col>
          </Row>
          <Row className='item-inline'>
            <Col span={18}>{appStore.language.data_analysis}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('analysis_auth', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.analysis_auth,
              })(
                <Switch />
              )}
            </Col>
          </Row>
          <Row className='item-inline'>
            <Col span={18}>{appStore.language.env}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('env_auth', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.env_auth,
              })(
                <Switch />
              )}
            </Col>
          </Row>
          <Row className='item-inline'>
            <Col span={18}>{appStore.language.bhv}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('bhv_auth', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.bhv_auth,
              })(
                <Switch />
              )}
            </Col>
          </Row>
          <Row className='item-inline head'>
            <Col span={12}></Col>
            <Col span={6} className='text-center'>{appStore.language.edit}</Col>
            <Col span={6} className='text-center'>{appStore.language.view}</Col>
          </Row>
          <Row className='item-inline'>
            <Col span={12}>{appStore.language.organism_info}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('biological_auth_edit', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.biological_auth_edit,
              })(
                <Switch />
              )}
            </Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('biological_auth_view', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.biological_auth_view,
              })(
                <Switch />
              )}
            </Col>
          </Row>
          <Row className='item-inline'>
            <Col span={12}>{appStore.language.person_info}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('user_auth_edit', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.user_auth_edit,
              })(
                <Switch />
              )}
            </Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('user_auth_view', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.user_auth_view,
              })(
                <Switch />
              )}
            </Col>
          </Row>
          <Row className='item-inline'>
            <Col span={12}>{appStore.language.device_set}</Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('setting_auth_edit', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.setting_auth_edit,
              })(
                <Switch />
              )}
            </Col>
            <Col span={6} className='text-center'>
              {getFieldDecorator('setting_auth_view', {
                valuePropName: 'checked',
                initialValue: !!userPermissions.setting_auth_view,
              })(
                <Switch />
              )}
            </Col>
          </Row>
        </Card>
      </Form>
    )
  }
}
const UserPermissionsForm = Form.create({
  onValuesChange: function (props, fields) {
    thisStore.set('loading', true)
    // console.log(props, fields)
    let _value = 1;
    let _key, _permission = thisStore.onAuthUser.permissions;
    for (const key in fields) {
      _key = key;
      if (key.indexOf('edit') > 0 || key.indexOf('view') > 0) {
        if (key.slice(-4) === 'edit') {
          _value = 2;
        }
        _key = key.slice(0, -5);
      }
      if (!fields[key]) {
        _value = -_value
      }
    }
    if (!_permission) {
      _permission = {
        analysis_auth: 0,
        bhv_auth: 0,
        biological_auth: 0,
        env_auth: 0,
        export_auth: 0,
        setting_auth: 0,
        user_auth: 0,
      }
    }
    _permission[_key] += _value;
    const _onAuthUser = Object.assign(thisStore.onAuthUser, {permissions: _permission});
    thisStore.setOnAuthUser(_onAuthUser);
    // console.log(_key, _value, _permission,_onAuthUser);
    axios.post(Api.updateUserPermission(thisStore.onAuthUser.id), _permission, httpConfig()).then(res => {
      message.success(appStore.language.user_auth_updated);
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  },
})(UserPermissions);
export default UserPermissionsForm