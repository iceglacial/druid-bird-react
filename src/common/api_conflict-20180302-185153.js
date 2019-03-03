import apiRoot from './api.root'
// const base_url = RootStore.getApiRoot();
const base = apiRoot.getApiRoot();
const api = {
  me: base + '/user/myself',// 获取当前保存 token 的用户信息 - get
  login: base + '/login', //登录 - post
  profile: base + '/user/profile',//获取用户配置信息 - get
  getUser: (id)=>`${base}/user/id/${id}`,//获取用户信息 - get
  deleteUser: (id)=>`${base}/user/id/${id}`,//删除用户 -  delete
  createUser: base + '/user/',//创建新用户 - post
  setUserFields: type=>`${base}/user/fields/${type}`,//修改用户表格项。type：device，env，behavior，sms
  updateMyInfo: base + '/user/info',//修改我的用户信息 - put
  updateUserPermission: (id)=>`${base}/user/id/${id}/edit_auth`,//更新用户授权 - post
  company: base + '/company',//获取公司信息 - get
  companyUser: base + '/user/',//获取公司成员 - get
  password: (id)=>`${base}/user/${id ? ('id/' + id) : ''}/password`,//修改密码 - put
  updateUserPassword: (id)=>`${base}/user/id/${id}/password`,//修改用户密码 - put
  device: (id)=>`${base}/device/${id ? ('id/' + id) : ''}`,//获取设备信息，单个【id】，多个 - get
  /**
   * 设备安装时间
   * @param id
   * {attached_at: xxxxxx}
   */
  deviceAttachTime: (id)=>`${base}/device/id/${id}/attach`,
  /*
   * 根据ID列表获取设备信息
   * method: post
   * request:
   {
   "id": [...],
   }
   */
  deviceByIDArray: base + '/device/many', //根据ID列表获取设备信息 - post
  deviceIdle: base + '/device/idle/owner',//获取所有未分配设备 - get
  deviceNoExclude: base + '/device/exclude', //排除ID列表设备，获取以外的所有设备信息（设备可分配给多个用户） - post
  updateUserDevice: (id)=>`${base}/user/${id}/device`,//分配设备给用户/把设备从用户移除 -  delete,post
  deviceOfUser: id=>`${base}/user/id/${id}/device`,//获取用户的设备 -  get
  /**
   * @request {id: [...]}
   * @param id
   * @returns {string}
   */
  addDeviceToUser: function (id) {//分配设备给用户 -  post
    return base + "/user/id/" + id + "/add_auth";
  },
  /**
   * @request {id: [...]}
   * @param id
   * @returns {string}
   */
  removeDeviceFromUser: function (id) {//分配设备给用户 -  post
    return base + "/user/id/" + id + "/del_auth";
  },
  deviceRegister: base + '/device/register',//注册／添加设备 - post
  deviceByUUID: function (uuid) {//获取设备信息 -  get
    return base + "/device/uuid/" + uuid;
  },
  deviceByID: function (id) {//获取设备信息 -  get
    return base + "/device/id/" + id;
  },
  gps: function (id) {//获取所有设备/单个设备的 GPS 信息 - get
    if (id) {
      return base + '/gps/device/' + id;
    } else {//获取所有设备的 GPS 信息 - get
      return base + '/gps/';
    }
  },
  //获取单个设备的 GPS 精简信息 - get
  gpsLine: (id)=>`${base}/gps/device/${id}/line`,
  gpsDays: (date)=>`${base}/statistics/device/resample/day/${date}`,
  behavior: (id)=> {//获取所有设备/单个设备的 behavior 信息 - get
    if (id) {
      return base + '/behavior/device/' + id;
    } else {//获取所有设备的 GPS 信息 - get
      return base + '/behavior/';
    }
  },
  sms: function (id) {//获取所有设备/单个设备的 sms 信息 - get
    if (id) {
      return base + '/gps/device/' + id + '/sms';
    } else {//获取所有设备的 GPS 信息 - get
      return base + '/gps/';
    }
  },
  gpsCount: function (id) {
    return base + '/statistics/gpscount/' + id;
  },
  biological: function (id, type) {//获取所有设备/单个设备的 GPS 信息 - get/post/put/delete
    /**
     * 获取： get - /[id]
     * 新建： post - when admin, request data need: owner_id
     * 更新： put - [id]
     * 删除： delete - [id]
     */
    var type = type || "bird";
    if (id) {
      return base + '/biological/device/' + id;
    } else {//获取所有设备的 GPS 信息 - get
      return base + '/biological/' + type + "/";
    }
  },
  updateBiological: function (device_id, type) {//获取所有设备/单个设备的 GPS 信息 - get/post/put/delete
    /**
     * 获取： get - /[id]
     * 新建： post - when admin, request data need: owner_id
     * 更新： put - [id]
     * 删除： delete - [id]
     */
    var type = type || "bird";
    return base + '/biological/' + type + '/' + device_id;
  },
  setting: function (id) {//获取所有设备/单个设备的 设备配置 - get
    if (id) {
      return base + '/setting/device/' + id;
    } else {//获取所有设备的 GPS 信息 - get
      return base + '/setting/';
    }
  },
  searchRangeDevice: ()=>(`${base}/ditu/`),
  searchDeviceByMark: (mark) =>`${base}/device/search/${mark}`,//通过mark - 搜索设备 -  get
  /**
   * {
        mark/uuid: [int]/[string]
     }
   */
  searchDevice: base + "/search/device",//通过mark - 搜索设备 -  post
  searchDeviceBySN: (sn) =>`${base}/device/mark/search/${sn}`,//通过mark - 搜索设备 -  get
  searchGps: () => `${base}/search/gps`,
  geofence: (id) =>`${base}/ditu/area${id ? ('/'+id) : ''}`,//创建、删除、获取围栏 -  get/delete/post
  geofenceOfUser: (id) =>`${base}ditu/user${id ? ('/'+ id) : ''}`,//创建、删除、获取用户的围栏 -  get/delete/post
    // 添加设备到围栏 - put
  geofenceAddDevice: (id)=>`${base}/ditu/area/${id}/adddevice`,
  // 从围栏移除设备 - put - {id: [...]}
  geofenceRemoveDevice: (id)=>`${base}/ditu/area/${id}/deldevice`,
  // 围栏内所有设备 - get - {id: [...]}
  deviceOfGeofence: (id)=>`${base}/ditu/area/${id}/device`,
  //设备关联的围栏 - get
  geofenceOfDevice: (id)=>`${base}/device/id/${id}/area`,
  // websocket 无效时，使用 http 获取最新消息(获取time以后的消息)
  messageNew: (time)=>`${base}/${time}`,
  // 获取历史消息(get) || 标注信息为已读(put)
  message: `${base}/message/`,
  //method: delete - 删除消息
  deleteMessage: (id) =>`${base}/message${id ? ('/id/'+ id) : '/delete'}`,
  /*
   * method: get - 获取历史消息
   * method: put - 标注信息为已读
   */
  messageUnread: base + "/message/unread",
  // 发送消息  - post
  sendMessage: base + "/message/",
  downloadDeviceGps: function (filetype,params,multiple) {
    /*
     * method: post
     * filetype: excel,kml
     * request:
     {
     "id": [
     "242424234234",
     "424242342423"
     ]
     }
     */
    var urlParams = '';
    if(params){
      for(var key in params){
        // data.hasOwnProperty(k)
        urlParams += '&' + key + "=" + params[key];
      }
      urlParams = urlParams.replace('&','?');
    };
    if(multiple || (filetype === 'kml')){//1
      return base+"/device/" + filetype + "_multiple" + urlParams;
    }else{
      return base+"/device/" + filetype + urlParams;
    }
  },
 /* googleMapLocation: function (lat, lng) {
    return window.location.protocol + "//ditu.google.cn/maps/api/geocode/json?latlng=" + lat + "," + lng + "&language=" + langService.getBroswerLang();
  },*/
}
export default api