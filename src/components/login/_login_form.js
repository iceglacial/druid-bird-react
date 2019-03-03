import React from 'react'
import {Form, Icon, Input, Button, Checkbox, message} from 'antd'
import {observer} from 'mobx-react'
import {Api, Token, MessageHandle} from '../../common'
import axios from 'axios'
import FindPasswordModal from './find_password.modal'
import LoginHeader from './login.head'
import appStore from '../../store/app_store'

const FormItem = Form.Item
@observer
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const username = values.userName
        const p = values.password
        const password = Token.set(username, p);//sha256(`${username} + druid + ${p} + heifeng`)
        const o = {
          username,
          password
        }
        this.checkLogin(o, values.remember)
      }
    })
  }

  /*登录验证*/
  checkLogin(o, remember) {
    axios.post(Api.login, o)
      .then(res => {
        const token = res.headers['x-druid-authentication']
        var tName = Token.tokenName
        if (remember) {
          window.localStorage.setItem(tName, token)
        } else {
          window.sessionStorage.setItem(tName, token)
        }
        // console.log('登录成功')
        appStore.getToken(token)
        appStore.getUser(res.data)
      })
      .catch(err => {
        MessageHandle(err,'login')
        // message.error('登录失败')
      })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div className="app-login" id="login" >
        {/*class:demo-login*/}
        {/*//style={{'background-image': 'url(images/bg/bg-login19201080.png)'}}*/}
        <LoginHeader />
        <div className='login-right-box'>
          <section className="login-content">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <h3 className="login-title">{appStore.language.login}</h3>
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: appStore.language.username_required}],
                })(
                  <Input prefix={<Icon type="user"/>} placeholder="Username"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: appStore.language.password_required}],
                })(
                  <Input prefix={<Icon type="lock"/>} type="password" placeholder="Password"/>
                )}
              </FormItem>
              <FormItem className='text-center'>
                <div className="block-overflow">
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox className='float-left'>{appStore.language.remember_me}</Checkbox>
                  )}
                </div>
                <Button type="primary" htmlType="submit" className="btn-submit">
                  {appStore.language.login}
                </Button>
                <div className="wrap">{appStore.language.forget_password} <FindPasswordModal /></div>
              </FormItem>
            </Form>
          </section>
        </div>
        <div className='login-footer'>
          <p className='title'>成都德鲁伊科技有限公司<span className='companion'> | 新华三技术有限公司</span></p>
          <p className='title-en'>Druid Technology Co. Ltd.</p>
        </div>
      </div>
    )
  }
}
const AppLoginForm = Form.create()(LoginForm)

export default AppLoginForm

