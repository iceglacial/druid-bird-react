import {observable, action} from 'mobx'
import Language from '../lang'
import mobx from 'mobx'
import {Token} from '../common'
import layoutStore from '../components/layout/store'

let pattern = {
    integer: new RegExp("^[0-9]*[1-9][0-9]$"),
    float: new RegExp("^(-?\d+)(\.\d+)?$"),
}

function getBroswerLang() {
    let browserLang = navigator.language;   //判断除IE外其他浏览器使用语言
    let isPathEN = window.location.pathname.indexOf('/en') > -1
    let pathLang;
    if (!browserLang) {//判断IE浏览器使用语言
        browserLang = navigator.browserLanguage;
    }
    !browserLang && (browserLang = 'en')
    let id = 1;
    if (browserLang === 'en') {
        id = 1;
    } else if (browserLang === 'zh-CN') {
        id = 0
    }
    if (!isPathEN) {
        pathLang = 'zhCN'
    } else {
        pathLang = 'en'
    }
    return {
        id: id + '',
        name: browserLang.replace('-', ''),
        lang: browserLang,
        pathID: isPathEN ? '1' : '0',
        pathLangName: pathLang
    };
}

let broswerLang = getBroswerLang()

function getDefaultMenu() {
    let hash = window.location.hash.slice(1);
    let openkey, selectedKey;
    let navs = mobx.toJS(layoutStore.nav);
    for (let nav of navs) {
        if (nav.url === hash) {
            selectedKey = nav.title;
            // console.log('default nav:',nav.title)
            break;
        } else if (nav.subNav) {
            for (let subNav of nav.subNav) {
                if (subNav.url === hash) {
                    selectedKey = subNav.title;
                    openkey = nav.title;
                    // console.log('default nav:',nav.title,subNav.title)
                    break;
                }
            }
        }
    }
    return {
        openKeys: openkey ? [openkey] : [],
        selectedKeys: selectedKey ? [selectedKey] : []
    }
}

// console.log(broswerLang)
let deviceFields = [
    'mark', 'updated_at', 'timestamp', 'latlon',/*'location',*/ 'firmware_version', 'device_type', 'network_operator', 'description'//, 'setting'
]
let envFields = [
    'updated_at', 'timestamp', 'longitude', 'latitude', 'battery_voltage', 'altitude', 'dimension', 'course', 'speed', 'used_star', 'temperature', 'humidity', 'light', 'pressure', 'signal_strength', 'firmware_version', 'device_type','mark', 'description', 'network_operator'
]
let bhvFields = [
    'updated_at', 'timestamp', 'activity_expend', 'activity_intensity', 'firmware_version'
]
let smsFields = [
    'updated_at', 'timestamp', 'longitude', 'latitude', 'battery_voltage', 'altitude', 'dimension', 'course', 'speed', 'used_star', 'temperature', 'humidity', 'light', 'pressure', 'signal_strength', 'firmware_version'
]
let appStore = observable({
    isLoggedIn: true,
    loading: true,
    reloadGrid: true,
    token: '',
    userFields: {
        device: [],
        env: [],
        bhv: [],
        sms: []
    },
    disabledFields: {
        device: ['mark', 'updated_at', 'timestamp','latlon',/*, 'location'*/],//, 'setting'
        env: ['updated_at', 'timestamp', 'longitude', 'latitude', 'battery_voltage'],//no:timestamp
        bhv: ['updated_at', 'timestamp', 'activity_expend'],//no:updated_at
        sms: ['updated_at', 'timestamp', 'longitude', 'latitude', 'battery_voltage']//no:timestamp
    },
    defaultFields: {
        device: deviceFields,
        env: envFields,
        bhv: bhvFields,
        sms: smsFields
    },
    user: null,
    pageSize: 20,
    languageID: broswerLang.pathID,
    language: Language[broswerLang.pathLangName],
    timeZone: 0,
    navState: getDefaultMenu(),
    updateUnreadMessage: false,
    settingItems: {
        'env_sampling_freq': [60 * 5, 60 * 10, 60 * 30, 60 * 60, 60 * 60 * 2, 60 * 60 * 3, 60 * 60 * 4, 60 * 60 * 8, 60 * 60 * 12, 60 * 60 * 24],
        'env_voltage_threshold': [3.7, 3.75, 3.8],
        'behavior_sampling_freq': [60 * 10, 60 * 30],//60*5,
        'behavior_voltage_threshold': [3.7, 3.75, 3.8],
        'gprs_freq': [60 * 10, 60 * 30, 60 * 60, 60 * 60 * 2, 60 * 60 * 4, 60 * 60 * 8, 60 * 60 * 12, 60 * 60 * 24, 60 * 60 * 24 * 2],
        'gprs_voltage_threshold': [3.8, 3.85, 3.9],
    },
    settingDefault: {
        "realtime": {
            behavior_sampling_freq: 60 * 10,
            behavior_sampling_mode: 1,
            behavior_voltage_threshold: 3.8,
            env_sampling_freq: 60 * 10,
            env_sampling_mode: 1,
            env_voltage_threshold: 3.7,
            gprs_freq: 60 * 60 * 24,
            gprs_mode: 1,
            gprs_voltage_threshold: 3.8,
        },
        "standard": {
            behavior_sampling_freq: 60 * 10,
            behavior_sampling_mode: 1,
            behavior_voltage_threshold: 3.8,
            env_sampling_freq: 60 * 60,
            env_sampling_mode: 1,
            env_voltage_threshold: 3.7,
            gprs_freq: 60 * 60 * 8,//60*60*24,
            gprs_mode: 1,
            gprs_voltage_threshold: 3.8,
        },
        "save": {
            behavior_sampling_freq: 60 * 10,
            behavior_sampling_mode: 2,
            behavior_voltage_threshold: 3.8,//3.8
            env_sampling_freq: 60 * 60 * 4,//14400,
            env_sampling_mode: 1,
            env_voltage_threshold: 3.7,
            gprs_freq: 60 * 60 * 24,
            gprs_mode: 1,
            gprs_voltage_threshold: 3.8,
        },
        "standby": {
            behavior_sampling_freq: 60 * 10,
            behavior_sampling_mode: 2,
            behavior_voltage_threshold: 3.8,//3.8
            env_sampling_freq: 60 * 60 * 4,
            env_sampling_mode: 2,
            env_voltage_threshold: 3.7,//3.7
            gprs_freq: 60 * 60 * 24,
            gprs_mode: 1,
            gprs_voltage_threshold: 3.8,
        },
    },
    biologicalItems: {
        'blood': ['neck', 'back'],
    },
    languageOptions: [0, 1],
    pageSizeOptions: [10, 20, 50, 100, 200],
    timeZoneOptions: [-720, -660, -600, -570, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0, 60, 120, 180, 210, 240,
        270, 300, 330, 345, 360, 390, 420, 480, 510, 540, 570, 600, 630, 660, 690, 720, 765, 780, 840],
    pattern: pattern,
    form: {
        email: {
            pattern: new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"),
            min: 5,
            max: 100
        },
        phone: {
            pattern: new RegExp("^[0-9+-]{1,}$"),
            min: 3,
            max: 20
        },
        username: {
            pattern: new RegExp("^[A-Za-z0-9._-]+$"),
            min: 3,
            max: 30
        },
        password: {
            pattern: new RegExp("^[A-Za-z0-9]{1,}$"),
            min: 3,
            max: 12
        },
        address: {
            max: 100
        },
    },
    biologicalValidator: {
        bid: {
            pattern: new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,50}$"),
            message: '中文，英文字母和数字及“_”(1-50)',//string_pattern
            min: 1,
            max: 50
        },
        number: {
            pattern: new RegExp("^[0-9]{0,3}$"),//^[1-9][0-9]{0,2}$:1-999
            message: '请输入0-999区间的正整数',
            min: 0,
            max: 999
        },
        number_float: {
            pattern: new RegExp("^[0-9]{0,3}((\.\d*|0\.\d*[1-9]\d*){0,3}?)$"),
            message: '请输入0-1000区间的浮点数(0.01)',//不包括1000
            min: 0,
            max: 1000
        },
        location: {
            pattern: new RegExp("^.{0,50}$"),
            message: '长度在0-50之间',
            min: 1,
            max: 50
        },
        latitude: {//纬度： -90.0～+90.0（整数部分为0～90，必须输入1到6位小数）
            pattern: new RegExp("^[\-\+]?([0-8]?\d{1}((\.\d{1,6}))?|90((\.0{0,6})?))$"),
            message: '-90.0 ～ +90.0',
            min: -90,
            max: 90
        },
        longitude: {//经度： -180.0～+180.0（整数部分为0～180，必须输入1到6位小数）
            pattern: new RegExp("^[\-\+]?(0?\d{1,2}((\.\d{1,6})?)|1[0-7]?\d{1}((\.\d{1,6})?)|180((\.0{1,6})?))$"),
            message: '-180.0 ～ +180.0',
            min: -180,
            max: 180
        },
        species: {
            pattern: new RegExp("^.{0,100}$"),
            message: '长度在0-100之间',
            min: 0,
            max: 100
        },
        note: {
            pattern: new RegExp("^.{0,200}$"),
            message: '长度在0-200之间',
            min: 0,
            max: 200
        }
    },
    validatorRules: {
        description: {
            pattern: new RegExp("^.{0,200}$"),
            message: '长度在0-200之间',
            min: 0,
            max: 200
        }
    },
})
const thisStore = appStore
thisStore.set = action((name, value) => {
    thisStore[name] = value
})
thisStore.changeIsLoggedIn = action(d => {
    thisStore.isLoggedIn = d
})
thisStore.setReloadGrid = action(state => {
    thisStore.reloadGrid = state
    if (state) {
        setTimeout(() => {
            thisStore.reloadGrid = false
        }, 0)
    }
})
thisStore.logOut = action(() => {
    Token.clearToken();
    thisStore.changeIsLoggedIn(false);
    window.location.hash = '#/login'
    // window.location.reload()
})
thisStore.getToken = action(t => {
    thisStore.token = t
})
thisStore.getUser = action(u => {
    thisStore.user = u
    let profile = u.profile || {}
    // let lang = typeof(profile.language) === 'number' ? profile.language : '1'
    thisStore.setLang(broswerLang.pathID)//不读取用户配置的语言
    thisStore.setPageSize(profile.page_size)
    thisStore.setTimeZone(profile.time_zone)
    // console.log(u.env_fields.fields)
    // 自定义表格项
    thisStore.userFields = {
        device: u.device_fields && u.device_fields.fields,
        env: u.env_fields && u.env_fields.fields,
        bhv: u.behavior_fields && u.behavior_fields.fields,
        sms: u.sms_fields && u.sms_fields.fields
    }
    //准备就绪
    thisStore.isLoggedIn = true
    thisStore.loading = false
})
thisStore.setTimeZone = action(offset => {
    thisStore.timeZone = offset || 0
})
thisStore.setPageSize = action(pageSize => {
    thisStore.pageSize = pageSize || 20
    // console.log('app store:',thisStore.pageSize)
})
thisStore.setNavState = action((state) => {
    thisStore.navState = state || getDefaultMenu()
})
thisStore.setLang = action(lang => {
    let lang_type = parseInt(lang)
    let isZhCN = lang_type === 0
    let isENPath = window.location.pathname.indexOf('/en') > -1
    thisStore.languageID = lang.toString()
    if (isZhCN) {
        thisStore.language = Language.zhCN
        isENPath && (window.location.pathname = '/')
    } else { //if (lang_type === 1)
        thisStore.language = Language.en
        !isENPath && (window.location.pathname = '/en')
    }
    // document.title = thisStore.language.title_document;
})
//#2466  错误时间的数据过滤
thisStore.dateCompare = action((dateString, compareDateString) => {
    const dateTime = new Date(dateString).getTime();
    const compareDateTime = new Date(compareDateString).getTime();
    if (compareDateTime > dateTime) {
        return 1;
    } else if (compareDateTime == dateTime) {
        return 0;//
    } else {
        return -1;//
    }
})
thisStore.isDateBetween = action((dateString, startDateString, endDateString) => {
    let flag = false;
    const startFlag = (thisStore.dateCompare(dateString, startDateString) < 1);
    const endFlag = (thisStore.dateCompare(dateString, endDateString) > -1);
    if (startFlag && endFlag) {
        flag = true;
    }
    return flag;
})
export default appStore