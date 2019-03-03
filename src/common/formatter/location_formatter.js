/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {observer} from  'mobx-react'
import appStore from '../../store/app_store'

@observer
class DeviceLocationFormatter extends React.Component {
  constructor(props) {
    super(props)
    // console.log(this.props.value);
  }

  render() {
    let geocoding = this.props.value || {};
    let lang = appStore.language.id;
    let location;
    if(lang === 'zh-cn'){
      location = geocoding['zh-CN']
    }else{
      location = geocoding['en']
    }
    return (
      <div className="react-grid-Cell-state" title={location}>
        {location}
      </div>
    )
  }
}
export default DeviceLocationFormatter