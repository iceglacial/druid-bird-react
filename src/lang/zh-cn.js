/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/15 0015.
 */
import common from './common'

const notification = {
    1: '入界',
    2: '出界'
}
const role = {
    user: '普通用户',
    admin: '管理员'
}
const keys = {
    mark: '设备编号',
    uuid: 'UUID',
    gps: '环境数据',
    longitude: '经度',
    latitude: '纬度',
    latlon:'最新设备位置坐标',
    used_star: '定位卫星数',
    updated_at: (type) => {
        let _val = type;
        switch (type) {
            case "device_set":
                _val = '最后修改时间';
                break;
            case "device_list":
                _val = '最新通信时间';
                break;
            case "gps":
            case "chart":
            case "behavior":
            case "bird":
                _val = '上传时间';
                break;
            case "user":
                _val = '最后更新时间';
            case "map":
                _val = '上传';
                break;
            default:
                _val = '上传';
                break;
        }
        return _val;
    },
    timestamp: (type) => {
        let _val = type;
        switch (type) {
            case "device_list":
                _val = '最新位置更新时间';
                break;
            case "gps":
            case "behavior":
            case "bird":
                _val = '采集时间';
                break;
            case "gps_type":
                _val = '采集时间（ENV）';
                break;
            case "bhv_type":
                _val = '采集时间（BHV）';
                break;
            case "bhv2_type":
                _val = '活动因子（ODBA）';
                break;
            case "chart":
                _val = '定位时长';
                break;
            case "map":
                _val = '采集';
                break;
            default:
                _val = '采集';
                break;
        }
        return _val;
    },
    battery_voltage: '电压',
    fix_time: '定位时长',
    altitude: '海拔高度',
    horizontal: '水平精度',
    vertical: '垂直精度',
    course: '航向',
    light: '光照',
    humidity: '湿度',
    pressure: '气压',
    dimension: '定位模式',
    speed: '速度',
    signal_strength: '网络信号强度',
    biological_type: '生物类型',
    location: '位置',
    owner: '来源',
    device: '设备',
    username: '用户名',
    password: '密码',
    old_password: '旧密码',
    re_password: '确认密码',
    new_password: '新密码',
    admin_password: '管理员密码',
    email: '邮箱',
    phone: '联系方式',
    address: '地址',
    role: '用户类型',
    company_name: '公司',
    export: '导出',
    temperature: '温度',
    user_auth: '用户授权',
    hardware_version: '硬件版本',
    firmware_version: '设备固件版本',
    downloaded_at: '配置生效时间',
    updated_by: '修改人',
    behavior_sampling_freq: '行为采样间隔',
    behavior_sampling_mode: '行为',//采样
    behavior_voltage_threshold: '行为电压门限',
    env_sampling_freq: '环境采样间隔',
    env_sampling_mode: '环境',//采样
    env_voltage_threshold: '环境电压门限',
    gprs_freq: '网络通信间隔',
    gprs_mode: '网络通信',
    gprs_version: 'GPRS反转门限',
    gprs_voltage_threshold: 'GPRS电压门限',
    ota_voltage_threshold: 'OTA电压门限',
    sp_number: '短信sp号码',
    description: '备注',
    note: '备注',
    permission: '权限',
    percentage: '定位成功率',
    activity_percent: '活动时间',
    activity_intensity: '活动强度',
    activity_time: '相对活动强度',
    activity_expend: '活动时间占比',
    sleep_time: '相对静止强度',
    sleep_expend: '静止时间占比',
    total_expend: '活动总强度',
    head: '头',
    user: '普通用户',
    admin: '管理员',
    breast: '胸',
    covert: '腹',
    tail: '尾',
    anal: '肛',
    throat: '咽',
    neck: '颈部',
    beak: '喙部',
    back: '背部',
    leg: '腿部',
    bid: '生物名',
    label: '安装位置',
    species: '物种',
    age: '年龄',
    gender: '性别',
    weight: '重量',
    beek_length: '喙长',
    head_length: '头长',
    wing_length: '翅长',
    tarsus_long: '跗跖 长',
    tarsus_short: '跗跖 短',
    tarsus_length: '跗跖',
    primary_feather_length: '第九初羽长',
    swab: '拭子',
    feather: '羽毛',
    blood: '血液采样',
    ear: '耳长',
    shoulder_height: '肩高',
    axillary_girth: '腋窝周长',
    hind_foot: '后足长',
    tail_length: '尾长',
    total_length: '总体长',
    ground_altitude: '地表海拔',
    relative_altitude: '飞行高度',
    culmen_length: '喙长',
    wingspan: '翼展',
    body_length: '体长',
    device_type_name: '设备名',
    device_type: '设备名',
    device_model: '设备型号',
    operator: '运营商',
    network_operator: '运营商',
    setting: '设置',
}
const highChartsLang = {
    contextButtonTitle: "图表导出菜单",
    decimalPoint: ".",
    downloadJPEG: "下载JPEG图片",
    downloadPDF: "下载PDF文件",
    downloadPNG: "下载PNG文件",
    downloadSVG: "下载SVG文件",
    drillUpText: "返回 {series.name}",
    loading: "加载中",
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    noData: "没有数据",
    numericSymbols: ["K", "M", "G", "T", "P", "E"],
    printChart: "打印图表",
    rangeSelectorFrom: "开始时间",
    rangeSelectorTo: "截至时间",
    rangeSelectorZoom: "缩放",
    resetZoom: "恢复缩放",
    resetZoomTitle: "恢复图表",
    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    thousandsSep: ",",
    weekdays: ["星期一", "星期二", "星期三", "星期三", "星期四", "星期五", "星期六", "星期天"]
}
let deviceNameOf = {
    neck_collar: '颈环',
    backpack: '背包',
    ear_tag: '耳标'
}
const zhCN = {
    id: 'zh-cn',
    name: '中文',
    title_document: '野生动物连接平台 - 德鲁伊科技',
    getLanguageName: (key) => {
        return common.getLanguageName(key)
    },
    getTimezone: (offset) => {
        return {
            name: getZoneName(offset),
            offset: common.zoneOffsetStr(offset)
        }
    },
    getKeyName: (key, type) => {
        if (!keys[key]) {
            return key
        } else {
            if (!type && (key === 'updated_at' || key === 'timestamp')) {
                type = 'gps'
            }
            return type ? keys[key](type) : keys[key]
        }
    },
    getNav: (name) => {
        return getNav(name)
    },
    getRole: (type) => {
        return role[type]
    },
    getFenceNotificationType: (type) => {
        return notification[type]
    },
    statusMessage: {
        400: ['请求格式错误。', '密码错误，请确认。', '账号或密码错误。', '用户名已存在。'],
        401: '登录授权已过期！',
        403: '您无权限进行此操作！',
        404: '404',
        500: ['发生内部错误，请联系德鲁伊科技有限公司！', '搜索区域无效。'],
        502: '服务器错误。',
        503: '用户名已存在。',
        504: '请求超时。',
    },
    highChartsLang,
    ageOptions: ['幼年', '青年', '壮年', '老年'],
    genderOptions: ['雌', '雄'],
    choose_dimension: '选择定位模式',
    please_choose: '请选择',
    search: '搜索',
    search_range_device: '搜索设备',
    reset: '重置',
    confirm: '确认',
    cancel: '取消',
    submit: '提交',
    delete: '删除',
    clear: '清除',
    remove: '移除',
    edit: '编辑',
    view: '查看',
    permission: '授权',
    advanced_search: '高级搜索',
    login: '登录',
    logout: '注销',
    open: '打开',
    close: '关闭',
    temporarily_closed: '暂时关闭',
    save: '保存',
    pageback: '返回',
    switch_account: '切换账号',
    latest_notification: '最新通知',
    view_all: '查看全部',
    view_details: '查看详情',
    edit_per_profile: '编辑个人资料',
    retrieve_password: '找回密码',
    remember_me: '记住登录',
    single_file: '单个文件',
    multiple_file_base_on_device: '多个文件(按设备)',
    export_device_gps: '导出环境数据',
    export: '导出',
    data_export: '数据导出',
    data_analysis: '数据分析',
    export_type: '导出类型',
    kml_export: '导出为 Kml',
    excel_export: '导出为 Excel',
    csv_export: '导出为 CSV',
    select_all: '全选',
    devices_location: '设备位置',
    device_path: '设备轨迹',
    device_parameter: '设备配置',
    modify_auth_device: '设备配置',
    modify_setting: '修改配置',
    done: '完成',
    special_note: '特别说明:当电压低于指定门限将自动停止采样',
    search_device_add: '搜索添加设备',
    mode: '模式',
    device_set: '设备配置',
    device_setting: '设备配置',
    device_setting_updated: (device) => {
        if (device) {
            return `设备${device.mark || device.uuid}配置修改成功！`
        } else {
            return '设备配置修改成功！'
        }
    },
    settings: '设置',
    device_manage: '设备管理',
    organism_info: '生物信息',
    view_auth_organism: '生物信息',
    device_biological_updated: (device) => `设备${device ? device.mark || device.uuid : ''}生物信息修改成功！`,
    description_updated: '备注修改成功！',
    basic_info: '基本信息',
    organism_measurement: '生物体征',
    organism_sample: '生物样品',
    operate: '操作',
    setting: '设置',
    env: '环境数据',
    bhv: '行为数据',
    odba: '活动因子',
    sms: '短信数据',
    no_device_selected: '未选择任何设备!',
    date_range: '起止时间',
    export_selected_file_to: '导出选中设备到',
    start_date: '开始日期',
    end_date: '结束日期',
    realtime_mode: '实时模式',
    standard_mode: '标准模式',
    save_mode: '省电模式',
    standby_mode: '待机模式',
    custom_mode: '自定义模式',
    time_interval: '时间间隔',
    threshold_voltage: '电压门限',
    validation_time: '生效时间',
    sampling_interval: '采样频率',
    label_radio_open: '开',
    label_radio_close: '关',
    data_visualization: '数据对比分析',
    select_data_type: '选择对比项',
    select_device: '选择设备',
    select_date_range: '选择日期',
    generating_chart: '生成图表',
    show_filter_box: '展开筛选框',
    hide_filter_box: '隐藏筛选框',
    choose_only_one_data_type: '多个设备只能选择单个对比项。',
    choose_only_one_device: '多个对比项只能选择单个设备。',
    choose_at_least_one_data_type: '至少选择一个对比项！',
    choose_at_least_one_device: '至少选择一个设备！',
    selected: '已选中',
    unselected: '未选择',
    device_count: '设备数量',
    create_account: '新建用户',
    account_created: '用户新建成功！',
    username_required: '请输入用户名。',
    username_pattern: '仅支持数字，字母，“.”,“_”，“-”。',
    username_minlength: (len) => `用户名至少${len}个字符。`,
    username_maxlength: (len) => `用户名不能超过${len}个字符。`,
    email_required: '请输入邮箱。',
    email_pattern: '邮箱格式错误。',
    email_minlength: (len) => `邮箱至少${len}个字符。`,
    email_maxlength: (len) => `邮箱不能超过${len}个字符。`,
    phone_required: '请输入联系方式。',
    phone_pattern: '联系方式格式错误。',
    phone_minlength: (len) => `联系方式至少${len}个字符。`,
    phone_maxlength: (len) => `联系方式不能超过${len}个字符。`,
    address_maxlength: (len) => `地址不能超过${len}个字符。`,
    password_required: '请输入密码。',
    repassword_required: '请再次输入密码',
    password_pattern: '仅支持数字和字母。',
    password_minlength: (len) => `密码至少${len}个字符。`,
    password_maxlength: (len) => `密码不能超过${len}个字符。`,
    password_not_match: '两次密码输入不一致!',
    delete_confirm: '删除确认',
    delete_user_confirm: (user) => `确认删除用户${user.username || ''}?`,
    deleted_user: (user) => `成功删除用户${user.username}。`,
    user_password_changed: (user) => `用户${user ? user.username || '' : ''}密码修改成功!`,
    edit_user: '编辑用户',
    person_info: '个人资料',
    edit_profile: '修改资料',
    edit_password: '修改密码',
    movebankSetting: 'MoveBank配置',
    movebank_notice1: "配置完成后将自动同步所有历史数据",
    movebank_notice2: "更改后，历史数据不能同步至新账号",
    movebank_notice3: "新账号只能查看配置当日起产生的新数据",
    movebank_notice4: "历史MoveBank账号的数据不会被删除",
    click_to_set: '点此设置',
    movebank_daily_notice: "*每日定时同步数据至MoveBank",
    movebank_confirm_username: "请确认MoveBank用户名:",
    movebank_change_username: "新的MoveBank用户名:",
    movebank_change_notice_1: '更改后，',
    movebank_change_notice_2: '历史数据不能同步至新账号',
    movebank_change_notice_3: '，仅可查看配置当日起产生的新数据。还要继续吗？',
    movebank_confirm_notice_1: "历史数据将自动同步且",
    movebank_confirm_notice_2: "仅自动同步至此账号",
    movebank_confirm_notice_3: "，确认同步至此账号吗？",
    single: '单个',
    multiple: '多个',
    data: '数据',
    date: '时间',
    last_week: '最后1周',
    last_month: '最后1月',
    flight: '飞行',
    activity_amount: '活动量',
    speed: '速度',
    course: '航向',
    height: '高度',
    altitude: '海拔高度',
    altitude2: '海拔',
    flight_altitude: '飞行高度',
    surface_height: '地表高度',
    charging: '充电',
    voltage: '电压',
    illumination: '光照',
    positioning: '定位',
    positioning_duration: '定位时长',
    number_of_positioning_satellites: '定位卫星数',
    internet_signal: '网络信号',
    internet_signal_strength: '网络信号强度',
    pressure: '气压',
    temperature: '温度',
    humidity: '湿度',
    sensor: '传感器',
    freedom_of_choice: '自由选择',
    select_month: '请选择月份',
    select_week: '请选择周',
    enter_device_mark:'输入设备号',
    average:'平均值',
    you_can_select_up_to_5_items_of_data: '您最多可以选择5项数据',
    you_can_choose_up_to_5_creatures: '您最多可以选择5个生物',
    please_select_a_device: '请选择设备',
    please_select_the_type_of_data_you_want_to_display: '请选择需要展示的数据类型',
    only_5_types_of_display_are_supported_at_the_same_time: '同时只支持5种类型显示',
    user_label: (user) => `用户：${user.username || '-'}`,
    device_count_label: (len) => `设备：${len || 0}`,
    sender_label: (sender) => `发送人：${sender || '-'}`,
    goefence_count_label: (len) => `围栏：${len || 0}`,
    allocate_device: '分配设备',
    user_auth_updated: '用户授权修改成功！',
    no_device: '没有设备',
    selected_count: (selected, all) => `${selected}/${all} 已选择`,
    remove_device_from_user_confirm: (device) => `确认移除设备${device.mark || device.uuid}？`,
    remove_device_from_user_success: (device) => `成功移除设备${device.mark || device.uuid}。`,
    add_device_to_user_success: (len) => `成功添加${len}个设备。`,
    other_setting: '其他设置',
    language: '语言',
    timezone: '时区',
    pagination: '分页',
    mark_as_read: '标记已读',
    page_size: '条/页',
    message_type: '消息类型',
    message_content: '消息内容',
    view_detail: '查看详情',
    device: '设备',
    username: '用户',
    add_filter: '添加筛选项',
    to: '至',
    fence_list: (len) => `围栏列表（${len}）`,
    fence_detail: '围栏详情',
    create_fence: '新建围栏',
    edit_fence: '编辑围栏',
    view_fence: '查看围栏',
    remove_fence: '移除围栏',
    fence_device_count: (count) => `设备：${count || 0}`,
    fence_notification_type: (type) => `通知：${notification[type] || '-'}`,
    delete_fence_confirm: (fenceName) => `确定要删除围栏${fenceName}？`,
    remove_fence_confirm: (fenceName) => `确定要移除围栏${fenceName}？`,
    delete_fence_success: (fenceName) => `成功删除围栏${fenceName}。`,
    remove_fence_success: (fenceName) => `成功移除围栏${fenceName}。`,
    edit_fence_success: (fenceName) => `成功修改围栏${fenceName}。`,
    notification_type: '通知',
    fence_name: '围栏名',
    radius: '半径',
    center: '圆心',
    acreage: '面积',
    please_enter_fence_name: '请输入围栏名',
    please_draw_fence_range: '请绘制围栏！',
    fence_acreage_exceed: '超过围栏最大面积限制！',
    fence_created: (fenceName) => `成功创建围栏${fenceName}`,
    left_top: '左上',
    right_bottom: '右下',
    circle: '圆形',
    round: '圆形',
    rectangle: '矩形',
    polygon: '多边形',
    fence_max_acreage: (area) => `围栏最大面积限制: ${area || ''}`,
    quick_search: '快速查找',
    ask_druid_to_retrieve_password: '请联系您的管理员或德鲁伊工作人员为您重置密码。',
    druid_phone: (phone) => `电话/传真：${phone}`,
    druid_email: (email) => `邮箱：${email}`,
    forget_password: '忘记密码？',
    pro_settings: '个人配置',
    pro_settings_updated: '个人配置修改成功',
    switch: '开关',
    acquisition_type: '采样类型',
    device_installation_time: '设备安装时间',
    marker_show_type: '位置点',
    show_cluster: '显示集群',
    show_markers: '显示标记',
    show_cluster_short: '集群',
    show_markers_short: '标记',
    search_range: '范围搜索',
    search_range_devices: '范围搜索（设备）',
    cancel_search_range: '取消搜索',
    reset_search_range_result: '重新搜索',
    device_latest_loc: `设备最后位置`,//(valid,all)=>（${valid || 0}/${all || 0}）
    countOfTotal: (valid, all) => `（${valid || 0}/${all || 0}）`,
    search_result_count: (count) => `搜索到 ${count || 0} 个设备：`,
    search_range_result_count: (count) => `搜索（范围搜索）到 ${count || 0} 个设备：`,
    search_gps_result_count: (count) => `搜索到 ${count || 0} 条环境数据：`,
    device_path_type: (deviceName) => `设备轨迹：${deviceName}`,
    last_months_path: (number) => `最近${number % 12 === 0 ? (number / 12 + '年') : (number + '个月')}`,
    last_days_path: (number) => `最近${number >= 30 ? (number / 30 + '个月') : (number + '天')}`,
    path_time_range: `轨迹时间`,
    searchFilters: '根据：',
    track_type: '轨迹类型',
    original_path: '原始轨迹',
    gps_path: '原始轨迹',
    gps_simple_path: '精简轨迹',
    sms_path: '短信轨迹',
    uploading_path: '回传位置',
    gps_path_short: '原始',
    gps_simple_path_short: '精简',
    sms_path_short: '短信',
    uploading_path_short: '回传',
    dead_time: '死亡时间：',
    select_read_message: '选中已读消息',
    select_unread_message: '选中未读消息',
    after: '以后',
    before: '以前',
    ascending: '升序',
    descending: '降序',
    total_count: (total) => `共 ${total || 0} 条数据`,
    page_count: (total) => `共 ${total || 0} 页`,
    mark_messages_as_read: '标记选中消息为已读',
    delete_message_success: `消息通知删除成功。`,
    dead: '死亡',
    alive: '存活',
    all: '全部',
    data_filter: '数据筛选',
    device_state: '状态',
    adult: '成鸟',
    juvenile: '幼鸟',
    female: '雌',
    male: '雄',
    measure_distance: '地图测距',
    exit_measure: '退出测距',
    last_fixes: '最后位置',
    historial_fixes: '历史位置',
    loading: '加载中',
    string_pattern: '中文，英文字母和数字及“_”（1-50）',
    number_pattern: (min, max) => `请输入${min}-${max}区间的正整数`,
    number_float_pattern: (min, max) => `请输入${min}-${max}区间的浮点数(0.01)`,
    length_pattern: (min, max) => `长度在${min}-${max}之间`,
    device_name: (type) => `${deviceNameOf[type]}`,
    new_edition: '新版',
    device_type_name: '设备名',
    device_model: '设备型号',
    operator: '运营商',
    china_mobile: '移动',
    unicom: '联通',
    show_analysis: '图表',
    show_data_list: '数据',
    updated: '设置成功!',
    onShowingGrid: '显示的列表项',
    hiddenGrid: '隐藏的列表项',
    uploading_time:'上传时间',
    acquisition_time:'采集时间',
    activity_index:'活动因子',
    chart_splitting:'图表拆分',
    chart_merging:'图表合并',
}

function getZoneName(offset) {
    let name;
    switch (offset) {
        case -720:
            name = "国际换日线";
            break;
        case -660:
            name = "中途岛标准时间";
            break;
        case -600:
            name = "夏威夷-阿留申标准时间";
            break;
        case -570:
            name = "马克萨斯群岛标准时间";
            break;
        case -540:
            name = "阿拉斯加标准时间";
            break;
        case -480:
            name = "太平洋标准时间";
            break;
        case -420:
            name = "北美山区标准时间";
            break;
        case -360:
            name = "北美中部标准时间";
            break;
        case -300:
            name = "北美东部标准时间";
            break;
        case -240:
            name = "大西洋标准时间";
            break;
        case -210:
            name = "纽芬兰岛标准时间";
            break;
        case -180:
            name = "南美标准时间";
            break;
        case -120:
            name = "巴西时间";
            break;
        case -60:
            name = "佛得角标准时间";
            break;
        case 0:
            name = "格林威治标准时间/欧洲西部时区";
            break;
        case 60:
            name = "佛得角标准时间 ";
            break;
        case 120:
            name = "欧洲东部时区";
            break;
        case 180:
            name = "莫斯科时区";
            break;
        case 210:
            name = "伊朗标准时间";
            break;
        case 240:
            name = "中东时区A";
            break;
        case 270:
            name = "阿富汗标准时间";
            break;
        case 300:
            name = "中东时区B";
            break;
        case 330:
            name = "印度标准时间";
            break;
        case 345:
            name = "尼泊尔标准时间";
            break;
        case 360:
            name = "孟加拉标准时间";
            break;
        case 390:
            name = "缅甸标准时间";
            break;
        case 420:
            name = "中南半岛标准时间";
            break;
        case 480:
            name = "东亚标准时间/中国标准时间(GMT)";
            break;
        case 510:
            name = "朝鲜标准时间";
            break;
        case 540:
            name = "远东标准时间";
            break;
        case 570:
            name = "澳大利亚中部标准时间";
            break;
        case 600:
            name = "澳大利亚东部标准时间";
            break;
        case 630:
            name = "澳大利亚远东标准时间";
            break;
        case 660:
            name = "努阿图标准时间";
            break;
        case 690:
            name = "诺福克岛标准时间";
            break;
        case 720:
            name = "太平洋标准时间B";
            break;
        case 765:
            name = "查塔姆群岛标准时间";
            break;
        case 780:
            name = "太平洋标准时间C";
            break;
        case 840:
            name = "太平洋标准时间D";
            break;
        default:
            break;
    }
    return name;
}

function getNav(name) {
    let navName = name;
    switch (name) {
        case 'device_list':
            navName = '设备浏览'
            break;
        case 'original_data':
            navName = '数据分类'
            break;
        case 'env':
            navName = '环境数据'
            break;
        case 'bhv':
            navName = '行为数据'
            break;
        case 'device_setting':
            navName = '设备配置'
            break;
        case 'geofence':
            navName = '地理围栏'
            break;
        case 'fence_list':
            navName = '围栏列表'
            break;
        case 'fence_of_device':
            navName = '设备围栏'
            break;
        case 'data_analysis':
            navName = '数据分析'
            break;
        case 'user_manage':
            navName = '用户管理'
            break;
        case 'pro_setting':
            navName = '个人中心'
            break;
        case 'my_setting':
            navName = '我的信息'
            break;
        case 'web_setting':
            navName = '个人设置'
            break;
        case 'push_notification':
            navName = '消息通知'
            break;
        default:
            break;
    }
    return navName;
}

// window['lang'] = zhCN
export default zhCN
