const google = window.google

const lineSymbol = {
  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
}
const drawPathLine = (isSearch) => {
  let line = new google.maps.Polyline({
      // path: [start, end],
      icons: [{
        repeat: '70px',
        icon: lineSymbol,
        offset: '100%'
      }],
      strokeColor: isSearch ? color() : "#FF3951", //颜色:blue: #00FAFF;red: #FF3951
      strokeOpacity: 1.0, //透明度
      strokeWeight: 2,    //宽度
      // map
    }
  )
  return line
}

function color() {
  return '#' + Math.floor(0x1000000 + Math.random() * 0x1000000).toString(16).slice(1);
}
export default drawPathLine