/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import {observable, action} from 'mobx'
// import appStore from '../../../store/app_store'
let accountStore = observable({
  loading: false,
    myHiddenFields: [],
    myFields: [],
  fieldsType: 'device'
})
const thisStore = accountStore;
thisStore.set = action((name, value) => {
  thisStore[name] = value
})
thisStore.setMyInfo = action(array => {
  thisStore.myInfo = array
})
export default accountStore