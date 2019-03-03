import React from 'react'
import {Layout, Menu, Icon, Button, Dropdown, Card, Row, Col, Radio, Avatar} from 'antd'
import {
  HashRouter as Router,
  Route,
  Link,
  withRouter,
  Switch
} from 'react-router-dom'
import {observer} from 'mobx-react'
import {ApiRoot, Token} from './../../common'
import appStore from '../../store/app_store'
import mobx from 'mobx'
// 转发一次路由:replace: '/redirect' to '';
import PathRedirect from './path.redirect'

import layoutStore from './store'
import UnreadMessageCount from './unread_message_count'
import SearchDevice from '../search/search.device'
// 弹窗
import SmartSearchModal from './smart_search.modal'
// 设备
import DeviceList from '../device/device_list'
import DeviceDetail from '../device/detail/device.detail'
import DevicesLocation from '../map/device.location/devices_location'///device.location
import DevicesPath from '../map/device.path/device_path'
import SearchOutDeviceList from '../device/searchout.device_list'

// 用户管理
import UserList from '../company/user.list'
import UserAuth from '../company/user.auth'
// 数据分类
import DataGpsGrid from '../data/gps'
import DataBehaviorGrid from '../data/behavior'
import SearchOutGps from '../data/searchout.gps'
// 设备配置
import DeviceSettingGrid from '../device.setting/device.setting'
import ModifySetting from '../device.setting/modify_setting/modify_setting'
// 地理围栏
import GeoFence from '../map/geofence_list/geofence_list'
import GeoFenceOfDevices from '../map/geofence/geofence_of_devices'
import GeoFenceDetail from '../map/edit_geofence/geofence_detail'
// import GeoFenceDetailManegeDevice from '../map/geofence/device_list.manage_devices'
import AddGeoFence from '../map/add_geofence/add_geofence'
// 数据分析
// import Analysis from '../analysis/analysis'
import Visualization from '../visualization/visualization'
// 个性设置
import MySetting from '../account/personal'
import WebSetting from '../account/user_fields/fields_tabs'
import MessagePage from '../account/message'

const {Header, Sider, Content} = Layout
const SubMenu = Menu.SubMenu

@observer
class AppLayout extends React.Component {
  constructor(props) {
    super(props)

    let _pathname = window.location.pathname.split('/')[1] || 'device';
    this.druidHomePage = ApiRoot.getHome()

    this.state = {
      collapsed: false,
      pathname: _pathname,
      smartSearchForm: '',
      unreadMessageCount: 0,
      navs: appStore.user.role === 'guest' ? layoutStore.guestNav : layoutStore.nav,
    }
  }

  toggleCollapsed = () => {
    let state = !this.state.collapsed
    this.setState({
      collapsed: !this.state.collapsed,
    })
    appStore.setReloadGrid(true)
  }

  Logout = () => {
    appStore.changeIsLoggedIn(false)
    Token.clearToken()
    this.props.history.push({
      path: '/login'
    })
  }
  handleMenuOpen = (openKeys) => {
    let navState = appStore.navState
    appStore.setNavState({
      openKeys: openKeys,
      selectedKeys: navState.selectedKeys
    })
    // console.log('handleMenuOpen',openKeys)
  }
  handleMenuClick = (target) => {
    let openkeys = target.keyPath[1]
    let selectedKey = target.keyPath[0]
    appStore.setNavState({
      openKeys: openkeys ? [openkeys] : [],
      selectedKeys: selectedKey ? [selectedKey] : []
    })
    // console.log('handleMenuClick',target)
  }
  handleVisibleChange = (flag) => {
    this.setState({visible: flag});
  }
  smartSearch = () => {
    layoutStore.setSmartSearchModalVisible(true);
  }
  setSmartSearchForm = (form) => {
    this.state.smartSearchForm = form;
  }
  turnLanguage = (e) => {
    appStore.setLang(e.target.value)
  }


  render() {
    let handleMenuClick = this.handleMenuClick;
    const NavMenuItem = (nav) => (
      <Menu.Item key={nav.title} >
        <Link to={nav.url}>
          <Icon type={nav.icon}/>
          <span>{appStore.language.getNav(nav.title)}</span>
        </Link>
      </Menu.Item>
    )
    const NavSubMenu = (nav) => (
      <SubMenu key={nav.title}
               title={<span><Icon type={nav.icon}/><span>{appStore.language.getNav(nav.title)}</span></span>}>
        {
          nav.subNav.map((value) => {
            return NavMenuItem(value)
          })
        }
      </SubMenu>
    )
    let currentUser = appStore.user || {};
    const menu = (
      <Card>
        <div className="custom-body">
          <div className="custom-head">
            {/*<Icon type="person"/>*/}
            <Avatar size="large" icon="person"/>
          </div>
          <div className="custom-content">
            <div className="inline-text"><Icon type="user"/>{currentUser.username}</div>
            <div className="inline-text"><Icon type="email"/>{currentUser.email}</div>
            <div className="inline-text"><Icon type="phone"/>{currentUser.phone}</div>
            <div className="inline-text"><Icon type="marker"/>{currentUser.address}</div>
            <div className="inline-text"><Icon type="eye"/>{appStore.language.getRole(currentUser.role)}</div>
            <div className="inline-text"><Icon type="company"/>{currentUser.company_name}</div>
          </div>
        </div>
        <div className="custom-foot">
          <Button type='danger' onClick={this.Logout}>{appStore.language.logout}</Button>
        </div>
      </Card>
    )
    let navState = mobx.toJS(appStore.navState)
    // console.log(navState)
    return (
      <Router>
          <Layout className={this.state.collapsed ? "layout-collapsed" : ''}>
          <Header className="">
            {/*class:linear-header*/}
            <Row type='flex'>
              <Col className='brand-box'>
                <div className="brand">
                  <Link to={`/`} onClick={() => appStore.setNavState({
                    openKeys: [],
                    selectedKeys: []
                  })}>
                    <div className="flex-row center">
                      <div className="brand-logo">
                        {
                          this.state.collapsed ? <Icon type="druid-name"/> : <Icon type="logo-druid-fullname"/>
                        }
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col className={`nav-box`}>
                <Row type={`flex`} justify='space-between'>
                  <Col className='search-box'>
                    <div className="inline search">
                      <div className='simple-search'><Icon type='search'/></div>
                      <div className='input-search'><SearchDevice history={this.props.history}/></div>
                    </div>
                    <div className="inline smart-search">
                      <div onClick={this.smartSearch} className="btn-ghost">{appStore.language.advanced_search}</div>
                      <SmartSearchModal
                        // ref={this.setSmartSearchForm}
                        visible={layoutStore.smartSearchModalVisible}
                        history={this.props.history}
                        // onCancel={this.hideSmartSearchModal}
                        // onCreate={this.saveSmartSearchModal}
                      />
                    </div>
                  </Col>
                  <Col className='quick-show-box'>
                    {
                      appStore.user.role !== 'guest' && <div className="inline message">
                        <UnreadMessageCount/>
                      </div>
                    }
                    <div className="inline user-box">
                      <Dropdown overlay={menu} trigger={['click']}
                                onVisibleChange={this.handleVisibleChange}
                                visible={this.state.visible}
                                overlayClassName={'user-dropdown'}
                      >
                        <Link to={`/account-setting/me`} onClick={() => appStore.setNavState({
                          openKeys: ['pro_setting'],
                          selectedKeys: ['my_setting']
                        })} className="ant-dropdown-link">
                          <Icon type="person"/>{appStore.user && appStore.user.username}
                        </Link>
                      </Dropdown>
                    </div>
                    <div className="inline">
                      <Radio.Group value={appStore.languageID} onChange={this.turnLanguage}>
                        <Radio.Button value="0">{appStore.language.getLanguageName(0)}</Radio.Button>
                        <Radio.Button value="1">{appStore.language.getLanguageName(1)}</Radio.Button>
                      </Radio.Group>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          <Layout className="main-layout">
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              className="slider-nav"
            >
              <div className="collapsed-turn">
                <div className="circle">
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'right' : 'left'}
                    onClick={this.toggleCollapsed}
                  />
                </div>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                openKeys={navState.openKeys}
                defaultSelectedKeys={navState.selectedKeys}
                selectedKeys={navState.selectedKeys}
                onOpenChange={this.handleMenuOpen}
                onClick={handleMenuClick}
                multiple={false}
                // inlineCollapsed={this.state.collapsed }
              >
                {this.state.navs.map((nav) => {
                  if (nav.subNav) {
                    return NavSubMenu(nav)
                  } else {
                    return NavMenuItem(nav);
                  }
                })}
              </Menu>
            </Sider>
            <Layout>
              <Content>
                <Switch>
                  <Route exact path="/" component={DeviceList}/>
                  {/*DeviceList,GridTest*/}
                  <Route exact path="/device" component={DeviceList}/>
                  <Route exact path="/device/redirect/:id" component={PathRedirect}/>
                  <Route exact path="/device/:id" component={DeviceDetail}/>

                  <Route exact path="/map/devices_location" component={DevicesLocation}/>
                  <Route exact path="/map/device_path/:id" component={DevicesPath}/>

                  <Route exact path="/data/gps" component={DataGpsGrid}/>
                  <Route exact path="/data/behavior" component={DataBehaviorGrid}/>

                  <Route exact path="/device_setting" component={DeviceSettingGrid}/>
                  <Route exact path="/modify_setting" component={ModifySetting}/>

                  <Route exact path="/user-manage" component={UserList}/>
                  <Route exact path="/user-manage/:id" component={UserAuth}/>

                  <Route exact path="/account-setting/me" component={MySetting}/>
                  <Route exact path="/account-setting/setting" component={WebSetting}/>
                  <Route exact path="/account-setting/message" component={MessagePage}/>

                  {/*<Route path="/analysis" component={Analysis}/>*/}
                  <Route path="/analysis" component={Visualization}/>

                  <Route exact path="/geofence" component={GeoFence}/>
                  <Route exact path="/devices/geofence" component={GeoFenceOfDevices}/>
                  <Route exact path="/geofence/id/:id" component={GeoFenceDetail}/>
                  <Route exact path="/geofence/id/:id/devices" component={GeoFenceDetail}/>
                  <Route exact path="/geofence/add" component={AddGeoFence}/>

                  <Route path="/data/gps/search_out/redirect" component={PathRedirect}/>
                  <Route path="/data/gps/search_out" component={SearchOutGps}/>

                  <Route path="/search_out/device/redirect" component={PathRedirect}/>
                  <Route path="/search_out/device" component={SearchOutDeviceList}/>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    )
  }
}
const _AppLayout = withRouter(AppLayout)
export default _AppLayout