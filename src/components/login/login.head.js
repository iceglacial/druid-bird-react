import React from 'react'
import {Radio, Icon} from 'antd'
import ApiRoot from '../../common/api.root'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'

@observer
class LoginHeader extends React.Component {
  constructor(){
    super();
    this.druidHomePage = ApiRoot.getHome();
  }
  turnLanguage = (e) => {
    appStore.setLang(e.target.value)
  }
  render(){
    return (
      <header>
        <div className="content-wrap">
          <div className="brand-content">
            <a href={this.druidHomePage} className="brand">
              <Icon type="logo-druid-fullname" />
              <div className='logo-box'></div>
            </a>
            {/*<div className="brand-name">*/}
              {/*<div className="brand-body">*/}
                {/*<div>*/}
                  {/*<a href={this.druidHomePage}>德鲁伊科技</a>*/}
                {/*</div>*/}
                {/*<div className="small">牧途-智能放牧系统</div>*/}
              {/*</div>*/}
            {/*</div>*/}
            <div className="language-wrap">
              <Radio.Group value={appStore.languageID+''} onChange={this.turnLanguage}>
                <Radio.Button value="0">{appStore.language.getLanguageName(0)}</Radio.Button>
                <Radio.Button value="1">{appStore.language.getLanguageName(1)}</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
      </header>
    )
  }
}
export default LoginHeader

