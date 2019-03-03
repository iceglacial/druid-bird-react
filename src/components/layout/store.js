/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/27 0027.
 */
import {observable, action} from 'mobx'

let layoutStore = observable({
    nav: [
        {
            title: 'device_list',
            icon: 'device',
            url: '/device'
        },
        // {
        //   title: 'original_data',
        //   icon: 'data',
        //   url: '/data',
        //   subNav: [
        //     {
        //       title: 'env',
        //       icon: '',
        //       url: '/data/gps'
        //     },
        //     {
        //       title: 'bhv',
        //       icon: '',
        //       url: '/data/behavior'
        //     }
        //   ]
        // },
        {
            title: 'device_setting',
            icon: 'setting',
            url: '/device_setting'
        },
        {
            title: 'geofence',
            icon: 'geofence',
            url: '',
            subNav: [
                {
                    title: 'fence_list',
                    icon: '',
                    url: '/geofence'
                },
                {
                    title: 'fence_of_device',
                    icon: '',
                    url: '/devices/geofence'
                }
            ]
        },
        {
            title: 'data_analysis',
            icon: 'analysis',
            url: '/analysis'
        },
        {
            title: 'user_manage',
            icon: 'person',
            url: '/user-manage'
        },
        {
            title: 'pro_setting',
            icon: 'pro-setting',
            url: '',
            subNav: [
                {
                    title: 'my_setting',
                    icon: '',
                    url: '/account-setting/me'
                },
                {
                    title: 'web_setting',
                    icon: '',
                    url: '/account-setting/setting'
                },
                {
                    title: 'push_notification',
                    icon: '',
                    url: '/account-setting/message'
                }
            ]
        },
    ], //导航菜单
    guestNav: [
        {
            title: 'device_list',
            icon: 'device',
            url: '/device'
        },
        {
            title: 'device_setting',
            icon: 'setting',
            url: '/device_setting'
        },
        {
            title: 'data_analysis',
            icon: 'analysis',
            url: '/analysis'
        },
        {
            title: 'pro_setting',
            icon: 'pro-setting',
            url: '',
            subNav: [
                {
                    title: 'my_setting',
                    icon: '',
                    url: '/account-setting/me'
                }
            ]
        },
    ], //导航菜单
    smartSearchSelectItems: {
        gps: ["mark", "uuid", "timestamp", "updated_at", "longitude", "latitude", "altitude", "humidity", "temperature", "light", "pressure", "dimension", "used_star", "speed", "signal_strength", "battery_voltage"],
        dimension: [1, 2],
        // behavior: ["activity_time","sleep_time","activity_expend","sleep_expend"]
    },
    searchItemData: {},//{key:value,...}
    smartSearchModalVisible: false,
})
const thisStore = layoutStore;
/**
 * 环境数据
 */
thisStore.setGridGps = action(array => {
    thisStore.gridGps = array
})
thisStore.setSmartSearchModalVisible = action(visible => {
    thisStore.smartSearchModalVisible = visible
})
thisStore.setSearchItemData = action((data) => {
    thisStore.searchItemData = data
})
thisStore.setNavs = action(navs => {
    thisStore.nav = navs
})
export default layoutStore