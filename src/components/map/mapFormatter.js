/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */

/*生成每个点的信息*/
function deviceLocationInfoWindow(info) {
  return `<div class="marker-window">
    <div>
      <div span="12"><div>设备编号：${info.mark} <button onclick={this.test(info.device_id)}>设备轨迹</button></div><div>UUID：${info.uuid}</div></div>
      <div span="12"><div>采集：${info.timestamp}</div><div>上传：${info.updated_at}</div></div>
    </div>
    <div>
      <div span="8"><div>经度：${info.longitude}</div><div>纬度：${info.latitude}</div><div>速度：${info.speed}</div><div>海拔高度：${info.altitude}</div><div>电压：${info.battery_voltage}</div></div>
      <div span="8"><div>定位模式：${info.dimension}</div><div>水平精度：${info.horizontal}</div><div>垂直精度：${info.vertical}</div><div>航向：${info.course}</div><div>定位卫星数：${info.used_star}</div></div>
      <div span="8"><div>光照：${info.light}</div><div>温度：${info.temperature}</div><div>湿度：${info.humidity}</div><div>气压：${info.pressure}</div><div>网络信号强度：${info.signal_strength}</div></div>
    </div>
  </div>`
}
/**
 * 获取设备弹窗需要显示的GPS信息
 * @param device
 * @returns {{}}
 */
function getDeviceLocationInfo(device) {
  var mapItems = ["device_id", "mark", "uuid", "timestamp", "updated_at", "latitude", "longitude", "temperature", "humidity", "light", "battery_voltage",
    "course", "dimension", "signal_strength", "speed", "used_star", "altitude", "horizontal", "vertical", "pressure"];
  let info = {}
  let _gps = device
  if (device.last_valid_gps) {
    _gps = device.last_valid_gps
  }
  for (let item of mapItems) {
    info[item] = _gps[item]
  }
  return info;
}
const mapFormatter = {
  getDeviceLocationInfo,
  deviceLocationInfoWindow
}
export default mapFormatter