/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/7 0007.
 */
const DruidInfo = {
    contact: {
        phone: '+86-028-85929148',
        email: {
            help: 'help@druid.tech',
        },
        getHome: () => {
            let testServer = "coolhei.com";
            let host = window.location.host;
            let isIp = host.match(new RegExp(/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/));
            let isLocal = host.indexOf('localhost') >= 0;
            let home = 'http://';
            let partURL = host.split(".");
            let urlLen = partURL.length;
            if (isIp || isLocal) {
                home += testServer;
            } else {
                if (host.indexOf('www.') > 0) {
                    home += 'www.'
                }
                home += partURL[urlLen - 2] + "." + partURL[urlLen - 1];
            }
            return home;
        },
    },
    geofence: {
        maxArea: 314159266, // radius:10000
        colors: {
            search: "#C01E1E",//0-深红: 地图搜索
            default: "#7ED321",//1-绿：#7ed321（列表）
            highLight: "#42B6DB",//2-蓝：#42B6DB（高亮）
            edit: "#FF3851",//3-红：#FF3851（新建／编辑）
        },
    },
}
export default DruidInfo