import React from 'react'
import {observer} from 'mobx-react'
import {Filters} from '../../common'
import {Modal} from 'antd'
import LayoutStore from './store'
import CollectionCreateForm from './smart_search.form'
import dataStore from '../data/store'
import appStore from '../../store/app_store'

const {arrayToSearchUrl} = Filters
@observer
class SmartSearchModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      smartSearchForm: '',
      loading: false,
    }
  }

  onCancel = () => {
    LayoutStore.setSmartSearchModalVisible(false)
  }
  onCreate = () => {
    // const form = this.state.smartSearchForm;
    // form.validateFields((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log(values)
    // })
    this.setState({
      loading: true
    })
    const isString = ['uuid', 'timestamp', 'updated_at']
    const isRange = ["mark", "timestamp", "updated_at", "longitude", "latitude", "altitude", "humidity", "temperature", "light", "pressure", "used_star", "speed", "horizontal", "vertical", "signal_strength", "battery_voltage"]
    let data = {}
    let searchItems = LayoutStore.searchItemData || {};
    if(searchItems.length){
      searchItems.map((item) => {
        let key = item.name
        let value = item.value
        // console.log(key,value)
        if (isRange.indexOf(key) !== -1) {
          let values = []
          if (isString.indexOf(key) !== -1) {
            values = value;
          } else {
            values.push(parseFloat(value[0]))
            values.push(parseFloat(value[1]))
          }
          data[key] = values;
        } else {
          if (isString.indexOf(key) !== -1) {
            data[key] = value;
          } else {
            data[key] = parseFloat(value);
          }
        }
      })
      let search = arrayToSearchUrl(data)
      dataStore.setSearchData(data)
      // console.log('save smart search...',data);
      // axios.post(Api.searchGps(),data,config).then(res=>{
      //   console.log('success',res)
      // }).catch(err=>{
      //   MessageHandle(err)
      // })
      LayoutStore.setSmartSearchModalVisible(false)
      this.props.history.replace({
        pathname: '/data/gps/search_out/redirect',
        search: search,
        state: data
      })
    }
    this.setState({
      loading: false
    })
  }
  setSmartSearchForm = (form) => {
    // console.log(form);
    this.state.smartSearchForm = form;
  }

  render() {
    const {visible, onCancel, onCreate} = this.props;//,device
    // const { getFieldDecorator,getFieldValue } = form;
    return (
      <Modal
        visible={visible}
        title={appStore.language.advanced_search}
        onCancel={this.onCancel}
        onOk={this.onCreate}
        okText={appStore.language.confirm}
        cancelText={appStore.language.cancel}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
        width={600}
        confirmLoading={this.state.loading}
      >
        <CollectionCreateForm ref={this.setSmartSearchForm}/>
      </Modal>
    )
  }
}
export default SmartSearchModal