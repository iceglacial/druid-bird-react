/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/21 0021.
 */

const getLanguageName = (key) => {
  if (key === 0) {
    return '中'
  } else if (key === 1) {
    return 'En'
  } else {
    return 'En'
  }
}
const zoneOffsetStr = (offset) => {
  let offsetStr;
  var simple = "UTC ";
  if (offset >= 0) {
    simple += "+";
  }
  var hour = parseInt(offset / 60);
  var minute = Math.abs(offset % 60);
  offsetStr = simple + hour.toString();
  if (minute > 0) {
    offsetStr += ":" + minute.toString();
  }
  return offsetStr
}
export default {
  getLanguageName,
  zoneOffsetStr
}