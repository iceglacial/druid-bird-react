/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/27 0027.
 */
import React from 'react'
import { Icon, Avatar} from 'antd'

import appStore from '../../store/app_store'

/**
 * 消息类型
 * @param value
 * @param row
 * @returns {XML}
 * @constructor
 */
const MSGTypeRender = (value, row) => {
  // console.log(value,row)
  let msgTypes = {
    1: 'setting-circle', //系统
    2: 'user-circle', //用户
    3: 'device-circle', //设备
    4: 'device-circle', //未知
    5: 'dead-circle', //生物
    6: 'geofence', //围栏
  }
  let iconType = {
    1: 'setting', //系统
    2: 'user', //用户
    3: 'device', //设备
    4: 'setting', //未知
    5: 'dead', //生物
    6: 'geofence', //围栏
  }
  let msgWarn = {
    0: 'normal',
    1: 'warning',
    2: 'danger'
  }
  let _msgType = msgTypes[row.type];
  let _iconType = iconType[row.type];
  let _msgLevel = 'exclamation-circle';
  let _warnClass = msgWarn[row.level];
  return <div className={`msg-type-box ${row.readed_at ? 'read' : ''}`}>
    <Icon className="msg_type" type={_msgType}/>
    {/*<Avatar size="large" icon={_iconType} />*/}
    <Icon className={`msg_level ${_warnClass}`} type={_msgLevel}/>
  </div>
}
/**
 * 消息内容
 * @param value
 * @param row
 * @returns {XML}
 * @constructor
 */
const MSGContentRender = (value, row) => {
  // console.log(value,row)
  let limitLen = 10
  let lang = appStore.language.id;
  let _targetType = row ? ((row.type === 1) && `${appStore.language.username}: `) || ((row.type === 2) && `${appStore.language.device}: `) : '';
  row.simple = false
  let targets = row.target_str || []
  let targetShow =()=> {
    let targetLabel = ((row.type === 1) && appStore.language.user_label(row.target_str))
      || ((row.type === 2) && appStore.language.device_count_label(targets.length))
      || ((row.type === 6) && appStore.language.goefence_count_label(targets.length))
    if(row.type !== 5){
      return <span className="item" title={appStore.language.view_detail}>
        {targetLabel}
        {/*{_targetType}{targets.length}*/}

        {/*{*/}
        {/*targets.map(function (value, index) {*/}
        {/*// if(simpled && index > 10){*/}
        {/*//   return;*/}
        {/*// }*/}
        {/*let _value = value;*/}
        {/*if (index > 0) {*/}
        {/*_value = ', ' + (value === '0' ? '-' : value);*/}
        {/*}*/}
        {/*if(row.type === 1){*/}
        {/*return <span key={Math.random() * 1000000} className="highlight"><Link to={`/user-manage/${row.target[index]}`}>{_value}</Link></span>*/}
        {/*}else if(row.type === 2){*/}
        {/*return <span key={Math.random() * 1000000} className="highlight"><Link to={`/device/${row.target[index]}`}>{_value}</Link></span>*/}
        {/*}*/}
        {/*})*/}
        {/*}*/}
      </span>
    }

  }
  return <div className={`message-body ${row.readed_at ? 'read' : ''}`}>
    <div className="title">
      <span className="item">{appStore.language.sender_label(row.src_name)}</span>
      {targetShow()}
    </div>
    <div className="content">{ (lang === 'zh-cn' && row.msg_cn) ? row.msg_cn : row.msg}</div>
  </div>
}
const TableRender = {
  MSGTypeRender,
  MSGContentRender
}
export default TableRender