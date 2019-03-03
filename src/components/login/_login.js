import React from 'react'
import {Redirect,} from 'react-router-dom'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'
import AppLoginForm from './_login_form'

@observer
class AppLogin extends React.Component {
  render() {
    if (appStore.isLoggedIn) {
      return (
        <Redirect to={{
          pathname: '/'
        }} />
      )
    }
    return (
      <AppLoginForm/>
    )
  }
}

export default AppLogin