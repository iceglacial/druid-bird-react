/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/26 0026.
 */
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days after today and today
  return current && current.valueOf() > moment().endOf('days');//Date.now();
}

function disabledRangeTime(_, type) {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
}
function disabledTime(time,type) {
  let timeObj = moment.utc(time).toObject()
  let disabled = {
    disabledHours: () => range(timeObj.hours, 23),
    disabledMinutes: () => range(timeObj.minutes, 60),
    disabledSeconds: () => [timeObj.seconds,60],
  }
  console.log(moment(time).toISOString(),timeObj,type)
  return disabled;
}
const DateSelect = {
  disabledDate,
  disabledRangeTime,
}
export default DateSelect