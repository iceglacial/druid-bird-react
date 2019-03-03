/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/7 0007.
 */
/**
 * @description 获取 api 根路径
 */
class Root{
  apiVersion = '/api/v2';
  // apiVersion = '/guest/api/v2';//测试guest
  testServer = "bird.coolhei.com";
  origin = window.location.origin;
  host = window.location.host + window.location.pathname.replace('/en','').slice(0,-1);
  isIp = this.host.match(new RegExp(/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/));//匹配IP； /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  isLocal = this.host.indexOf('localhost') >= 0;
  getApiRoot = (ws)=>{
    let apiRoot;
    if(this.isLocal || this.isIp){
      apiRoot = 'https://' + this.testServer + this.apiVersion;
    }else{
      apiRoot = 'https://' + this.host + this.apiVersion;
    }
    return apiRoot;
  };
  getHome = ()=>{
    let home = 'http://';
    let partURL = this.host.split(".");
    let urlLen = partURL.length;
    if(this.isIp || this.isLocal){
      home += this.testServer;
    }else{
      if(this.host.indexOf('www.') > 0){
        home += 'www.'
      }
      home += partURL[urlLen-2] + "." + partURL[urlLen-1];
    }
    return home;
  }
}
const rootStore = new Root();
export default rootStore