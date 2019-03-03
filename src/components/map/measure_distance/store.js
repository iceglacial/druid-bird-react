/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'

const google = window.google
let measureStore = observable({
  map: null,
  onMeasure: false,
})
const thisStore = measureStore;
/**
 * 初始化地图
 */
thisStore.initMap = action(map => {
  thisStore.map = map
})
thisStore.setOnMeasure = action(state => {
  thisStore.onMeasure = state
})
export default measureStore;