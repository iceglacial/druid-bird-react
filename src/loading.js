import React from 'react'
import appStore from './store/app_store'
import {observer} from 'mobx-react'
import {Icon,Row} from 'antd'
import {
  HashRouter as Router,
  Redirect,
} from 'react-router-dom'


@observer
class AppLogin extends React.Component {
  render() {
    if (!appStore.loading) {
      return (
        <Redirect to={{
          pathname: window.location.hash.replace('#','')
        }} />
      )
    }else if(!appStore.isLoggedIn){
      return (
        <Redirect to={{
          pathname: '/login'
        }} />
      )
    }
    return (
      <Router>
        <Row type='flex' justify='center' className='loading-page'>
            {/*<Icon type="loading"/>*/}
          <img src="images/loading.gif" alt=""/>
        </Row>
      </Router>
    )
  }
}

export default AppLogin