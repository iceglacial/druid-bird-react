/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import sha256 from 'js-sha256'

const tokenName = getTokenName();
const myToken = {
  // 计算token名
  tokenName: tokenName,
  token: '',
  // 获取 Token
  getLocalToken: ()=>{
    let tName = tokenName;
    let token = window.sessionStorage.getItem(tName) || window.localStorage.getItem(tName);
    this.token = token;
    return token;
  },
  clearToken: ()=>{
    delete window.localStorage[tokenName];
    delete window.sessionStorage[tokenName];
    // hashHistory.push({pathname: '/login'})
  },
  set: (username,password)=>{
   return sha256(`${username} + druid + ${password} + heifeng`);
  }
}
function getTokenName() {
  // let s = window.location.host + window.location.pathname.split('/')[0];
  // let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]");
  // let password = "Druid Technology";
  // password = password.split("");
  // let rs = "";
  // for (let i = 0; i < s.length; i++) {
  //   let tmp = s.substr(i, 1);
  //   if(tmp.match(pattern)){
  //     tmp = password.splice(0,1);
  //     tmp = tmp.toString().trim().replace(pattern, "");
  //   }
  //   rs =  rs + tmp;
  // }
  // return rs;
  let host = window.location.host;
  let platform = 'bird';
  let site = 'data-center';
  return `${host}+${platform}+${site}`;
}
export default myToken