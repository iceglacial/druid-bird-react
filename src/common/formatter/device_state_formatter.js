/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {Icon, Row, Col, Popover} from 'antd'
import {Filters} from '../../common'
import {Link} from 'react-router-dom'
import appStore from '../../store/app_store'
const {
  stateFilter,
  unitFilter
} = Filters

class DeviceStateFormatter extends React.Component {
  constructor(props) {
    super(props)
    // this.data = props.dependentValues;
    // console.log(props.dependentValues.mark);
  }

  render() {
    let data = this.props.dependentValues
    let todayGps = data.today_gps || {};
    let lastGps = data.last_gps || {};
    let lastBehavior = data.last_behavior || {};
    let lastBehavior2 = data.last_behavior2 || {};
    // let lastValidGps = data.last_valid_gps || {};
    let surviceTime = data.survive_time;
    let latIsSMS = (lastGps.sms === 1)
    let temprature = latIsSMS ? null : lastGps.temperature
    let volState = stateFilter(data && data.battery_voltage, 'battery_voltage');
    let temperatureState = stateFilter(temprature, 'temperature');
    let mark = (data.mark < 0) ? '-' : data.mark
    return (
      <div className="react-grid-Cell-state">
        <Link to={`/device/${data.id}`}>
          <Row type='flex' justify='space-between'>
            <Col className={`${data.survive ? 'danger' : ''} title`}>
              {
                surviceTime ? <Popover title={appStore.language.dead_time} content={unitFilter(surviceTime,'timestamp')  || '-'} trigger="hover">
                  {mark}
                  {/*{this.data.survive ? <Icon type="dead"/> : ''}*/}
                </Popover>
                  : <span>{mark}</span>
              }
            </Col>
            <Col className="state-box">
              <Popover title={appStore.language.getKeyName('timestamp','gps_type')} content={unitFilter(lastGps.timestamp,'timestamp') || '-'} trigger="hover">
                <Icon style={{fontSize:'20px'}} type="env" className={data.today_gps ? 'primary' : ''}/>
              </Popover>
              {
                data.firmware_version < 100 ?
                    <Popover title={appStore.language.getKeyName('timestamp', 'bhv_type')}
                             content={unitFilter(lastBehavior.timestamp, 'timestamp') || '-'} trigger="hover">
                      <Icon style={{fontSize:'20px'}} type="bhv" className={data.today_beh ? 'primary' : ''}/>
                    </Popover> :
                    <Popover title={appStore.language.getKeyName('timestamp', 'bhv2_type')}
                             content={unitFilter(lastBehavior2.timestamp, 'timestamp') || '-'} trigger="hover">
                      <Icon style={{fontSize:'20px'}} type="ODBA" className={data.today_beh2 ? 'primary' : ''}/>
                    </Popover>
              }
              <Icon type="msg" className={latIsSMS ? 'primary' : ''}/>
              <Popover content={unitFilter(data.battery_voltage,'battery_voltage') || '-'} trigger="hover">
                <Icon type={volState.icon} className={volState.className}/>
              </Popover>
              <Popover content={unitFilter(temprature,'temperature') || '-'} trigger="hover">
                <Icon type={temperatureState.icon} className={temperatureState.className}/>
              </Popover>
            </Col>
          </Row>
        </Link>
      </div>
    )
  }
}
export default DeviceStateFormatter