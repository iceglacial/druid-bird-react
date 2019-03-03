import React, {Component} from 'react'
import {observer} from 'mobx-react'
import AppRouter from './_router'
import {LocaleProvider} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import appStore from './store/app_store'

@observer
class App extends Component {
  render() {
    let locale = zhCN
    if(appStore.languageID == '1'){
      locale = enUS
    }
    return (
    <LocaleProvider locale={locale}>
      <div className="App">
        <div className="loading"></div>
        <AppRouter/>
      </div>
    </LocaleProvider>
    )
  }
}

export default App
