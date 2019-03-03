import React from 'react'
import AppLayout from './components/layout/_layout'
import {observer} from 'mobx-react'
import {Api, Token, httpConfig} from './common'
import axios from 'axios'
import appStore from './store/app_store'
import {
  HashRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import AppLogin from './components/login/_login'
import AppLoading from './loading'

@observer
class AppRouter extends React.Component {
  constructor() {
    super()
    if (!appStore.user) {
      if (!Token.getLocalToken()) {
        appStore.changeIsLoggedIn(false);
      } else if (Token.getLocalToken()) {
        axios.get(Api.me, httpConfig()).then(res => {
          // console.log(res.data);
          appStore.getUser(res.data)
          // appStore.changeIsLoggedIn(true);
        }).catch(res => {
          appStore.changeIsLoggedIn(false);
        })
      }
    }
  }

  render() {
      return (
        <Router>
          <div className="app-container">
            <Route
              path="/"
              render={
                () => (
                  appStore.isLoggedIn ? (
                    appStore.loading
                      ? <AppLoading/>
                      : <AppLayout />
                  ) : (
                    <AppLogin />
                  )
                )
              }
            />
            {/*<Redirect to="/login"/>*/}
            {/*<Route path="/login" component={AppLogin} />*/}
            {/*<Route path="/loading" component={AppLoading} />*/}
            {/*<Route path="/" component={AppLayout}/>*/}
          </div>
        </Router>

      )
    }
}


export default AppRouter