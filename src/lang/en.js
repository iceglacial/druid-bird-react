/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/15 0015.
 */
import common from './common'

const notification = {
    1: 'Exit',
    2: 'Enter'
}
const role = {
    user: 'User',
    admin: 'Admin'
}
const keys = {
    mark: 'S/N',
    uuid: 'UUID',
    gps: 'ENV Collection',
    longitude: 'Longitude',
    latitude: 'Latitude',
    latlon:'Latest coordinate',
    used_star: 'Sat.Qty.',
    updated_at: (type) => {
        let _val = type;
        switch (type) {
            case "device_set":
                _val = 'Last modified on';
                break;
            case "device_list":
                _val = 'Last Communication Time';
                break;
            case "gps":
            case "chart":
            case "behavior":
            case "bird":
                _val = 'Uploading time';
                break;
            case "user":
                _val = 'Last Upload Time';
                break;
            default:
                _val = 'Connected At';
                break;
        }
        return _val;
    },
    timestamp: (type) => {
        let _val = type;
        switch (type) {
            case "device_list":
                _val = 'Location updated on';
                break;
            case "gps":
            case "behavior":
            case "bird":
                _val = 'Collecting time';
                break;
            case "gps_type":
                _val = 'Acquisition Time (ENV)';
                break;
            case "bhv_type":
                _val = 'Acquisition Time (BHV)';
                break;
            case "bhv2_type":
                _val = 'Activity Index（ODBA）';
                break;
            case "chart":
                _val = 'Time for Positioning';
                break;
            default:
                _val = 'Updated At';
                break;
        }
        return _val;
    },
    battery_voltage: 'Voltage',
    fix_time: 'Time for Positioning',
    altitude: 'Altitude',
    horizontal: 'HorAccuracy',
    vertical: 'VerAccuracy',
    course: 'Azimuth',
    light: 'Light intensity',
    humidity: 'Relative Humidity',
    pressure: 'Air Pressure',
    dimension: 'Positioning Mode',
    speed: 'Speed',
    signal_strength: 'Network SigStrength',
    biological_type: 'Biotype',
    location: 'Location',
    owner: 'Source',
    device: 'Device',
    username: 'Username',
    password: 'Password',
    old_password: 'Old Password',
    re_password: 'Confirm password',
    new_password: 'New Password',
    admin_password: 'Admin password',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    role: 'User Type',
    company_name: 'Institution',
    export: 'Export',
    temperature: 'Temperature',
    user_auth: 'User Permission',
    hardware_version: 'Hardware Version',
    firmware_version: 'FW Version',
    downloaded_at: 'Applied on',
    updated_by: 'Last modified on',
    behavior_sampling_freq: 'BHV Collection Interval',
    behavior_sampling_mode: 'BHV Collection',//Acquisition
    behavior_voltage_threshold: 'BHV Voltage Threshold',
    env_sampling_freq: 'ENV Collection Interval',
    env_sampling_mode: 'ENV Collection',//Acquisition
    env_voltage_threshold: 'ENV Voltage Threshold',
    gprs_freq: 'Comm. Interval',
    gprs_mode: 'Communication',
    gprs_version: 'GPRS Reversal Threshold',
    gprs_voltage_threshold: 'GPRS Voltage Threshold',
    ota_voltage_threshold: 'OTA Voltage Threshold',
    sp_number: 'SMS Sent To',
    description: 'Remark',
    note: 'Remark',
    permission: 'Permission',
    percentage: 'Success Rate of Positioning',
    activity_percent: 'Activity Time',
    activity_intensity: 'Activity Intensity',
    activity_time: 'Relative Activity Intensity',
    activity_expend: 'Activity Time Percentage',
    sleep_time: 'Relative Inactivity Intensity',
    sleep_expend: 'Inactivity (%)',
    total_expend: 'Activity Intensity',
    head: 'Head',
    user: 'User',
    admin: 'Admin',
    breast: 'Breast',
    covert: 'Belly',
    tail: 'Tail',
    anal: 'Vent',
    throat: 'Throat',
    neck: 'Neck',
    beak: 'Beak',
    back: 'Back',
    leg: 'Leg',
    bid: 'Animal Name',
    label: 'Installation Position',
    species: 'Species',
    age: 'Age',
    gender: 'Sex',
    weight: 'Weight',
    beek_length: 'Beak length',
    head_length: 'Head length',
    wing_length: 'Wing length',
    tarsus_long: 'Tarsus Long',
    tarsus_short: 'Tarsus Short',
    tarsus_length: 'Tarsus length',
    primary_feather_length: '9th Primary',
    swab: 'Swab',
    feather: 'Feather',
    blood: 'Blood Sample',
    ear: 'Ear',
    shoulder_height: 'Shoulder Height',
    axillary_girth: 'Axillary Girth',
    hind_foot: 'Hind Foot',
    tail_length: 'Tail length',
    total_length: 'Total Length',
    ground_altitude: 'Elevation',
    relative_altitude: 'Flight Height',
    culmen_length: 'Culmen length',
    wingspan: 'Wingspan',
    body_length: 'Body length',
    device_type_name: 'Device Name',
    device_type: 'Device Model',
    device_model: 'Device Model',
    operator: 'Operator',
    network_operator: 'Operator',
    setting: 'Setting',
    attached_at: 'Device installation time',
}
const highChartsLang = {
    contextButtonTitle: "Chart Context Menu",
    decimalPoint: ".",
    downloadJPEG: "Download JPEG image",
    downloadPDF: "Download PDF document",
    downloadPNG: "Download PNG image",
    downloadSVG: "Download SVG vector image",
    drillUpText: "Back to {series.name}",
    loading: "Loading...",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    noData: "No data to display",
    numericSymbols: ["k", "M", "G", "T", "P", "E"],
    printChart: "Print chart",
    rangeSelectorFrom: "From",
    rangeSelectorTo: "To",
    rangeSelectorZoom: "Zoom",
    resetZoom: "Reset zoom",
    resetZoomTitle: "Reset zoom level 1:1",
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    thousandsSep: ",",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}
let deviceNameOf = {
    neck_collar: 'Neck Collar',
    backpack: 'Backpack',
    ear_tag: 'Ear Tag'
}
const EN = {
    id: 'en',
    name: 'English',
    title_document: 'Bird Tracking - Druid Technology',
    getLanguageName: (key) => {
        return common.getLanguageName(key)
    },
    getKeyName: (key, type) => {
        // console.log(key,type ? getKeyName[key](type) : getKeyName[key])
        if (!keys[key]) {
            return key
        } else {
            if (!type && (key === 'updated_at' || key === 'timestamp')) {
                type = 'gps'
            }
            return type ? keys[key](type) : keys[key]
        }
    },
    getTimezone: (offset) => {
        return {
            name: getZoneName(offset),
            offset: common.zoneOffsetStr(offset)
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
        400: ['Request format incorrect!', 'Password incorrect!', 'Account or password incorrect!', 'Username already exists.'],
        401: 'Authorized login expired!',
        403: 'This operation is not permitted.',
        404: '404',
        500: ['Internal error, please contact Druid!', 'Searching region error!'],
        502: 'Server Error.',
        503: 'Username existed.',
        504: 'Request timeout.',
    },
    highChartsLang,
    ageOptions: ['Childhood', 'Juvenile', 'Mature', 'Aged'],
    genderOptions: ['Female', 'Male'],
    choose_dimension: 'Choose Mode',
    please_choose: 'Please Choose... ',
    search: 'Search',
    search_range_device: 'Search for Devices',
    reset: 'Reset',
    confirm: 'Confirm',
    cancel: 'Cancel',
    submit: 'Submit',
    open: 'On',
    close: 'Off',
    temporarily_closed: 'Temporarily Closed',
    delete: 'Delete',
    remove: 'Remove',
    clear: 'Clear',
    edit: 'Edit',
    view: 'View',
    save: 'Save',
    pageback: 'Back',
    permission: 'Permission',
    advanced_search: 'Advanced Search',
    login: 'Login',
    logout: 'Log out',
    switch_account: 'Switch Account',
    latest_notification: 'Latest Notification',
    view_all: 'View All',
    view_details: 'View Details',
    edit_per_profile: 'Edit Personal profile',
    retrieve_password: 'Retrieve Password',
    remember_me: 'Remember Me',
    single_file: 'A Single File',
    multiple_file_base_on_device: 'Multiple Files (Based on Devices)',
    export_device_gps: 'Export ENV Data to File',
    export: 'Export',
    data_export: 'Data export',
    data_analysis: 'Data analysis',
    export_file_type: 'Export File',
    kml_export: 'Export to .kml',
    excel_export: 'Export to .xlsx',
    csv_export: 'Export to .csv',
    select_all: 'Select All',
    devices_location: 'Locations',
    device_path: 'Track',
    device_parameter: 'Device setting',
    modify_auth_device: 'Device setting',
    modify_setting: 'Modify Setting',
    done: 'Done',
    special_note: 'Note: Data collection stops when the device voltage is lower than the threshold.',
    search_device_add: 'Search to add devices',
    mode: 'Mode',
    device_set: 'Device setting',
    device_setting: 'Device setting',
    device_setting_updated: (device) => {
        if (device) {
            return `Device ${device ? device.mark || device.uuid : ''} setting updated.`
        } else {
            return 'Device setting updated.'
        }
    },
    settings: 'Settings',
    device_manage: 'Device Management',
    organism_info: 'Animal information',
    view_auth_organism: 'Animal information',
    device_biological_updated: (device) => `Device ${device ? device.mark || device.uuid : ''} Animal information updated.`,
    description_updated: 'Remark updated.',
    basic_info: 'Basic Information',
    organism_measurement: 'Measurement',
    organism_sample: 'Organism Sample',
    operate: 'Operation',
    setting: 'Settings',
    env: 'ENV Data',
    bhv: 'BHV Data',
    odba: 'Activity index',
    sms: 'SMS Data',
    date_range: 'Date range',
    export_selected_file_to: 'Export Selected File to',
    start_date: 'Starting date',
    end_date: 'Ending date',
    realtime_mode: 'Real time',
    standard_mode: 'Standard',
    save_mode: 'Power saving',
    standby_mode: 'Standby',
    custom_mode: 'Custom',
    time_interval: 'Time Interval',
    threshold_voltage: 'Voltage Threshold',
    validation_time: 'Applied on',
    sampling_interval: 'Collection Interval',
    label_radio_open: 'On',
    label_radio_close: 'Off',
    data_visualization: 'Data Visualization',
    select_data_type: 'Select data fields',
    select_device: 'Select device',
    select_date_range: 'Select date',
    generating_chart: 'Generate chart',
    show_filter_box: 'Show filter',
    hide_filter_box: 'Hide filter',
    device_choose_note: 'Only one device can be selected when comparing multiple fields of data.',
    data_analysis_choose_note: 'Only one fields of data can be selected when comparing multiple devices.',
    choose_only_one_data_type: 'You can choose only one data field for multiple devices.',
    choose_only_one_device: 'You can choose only one device for more than one data field.',
    selected: 'Selected',
    unselected: 'Unselected',
    device_count: 'Device Qty.',
    create_account: 'Create Account',
    account_created: 'Account created successfully.',
    username_required: 'Enter username.',
    username_pattern: 'Letters, numbers, or special characters(".", "_", "-")',
    username_minlength: (len) => `Username cannot be less than ${len} characters.`,
    username_maxlength: (len) => `Username cannot be greater than ${len} characters.`,
    email_required: 'Enter email.',
    email_pattern: 'Email Format Error.',
    email_minlength: (len) => `Email cannot be less than ${len} characters.`,
    email_maxlength: (len) => `Email cannot be greater than ${len} characters.`,
    phone_required: 'Enter phone.',
    phone_pattern: 'Phone Format Error.',
    phone_minlength: (len) => `Phone cannot be less than ${len} characters.`,
    phone_maxlength: (len) => `Phone cannot be greater than ${len} characters.`,
    address_maxlength: (len) => `Address cannot be greater than ${len} characters.`,
    password_required: 'Enter password.',
    repassword_required: 'Please confirm your password.',
    password_pattern: 'Letters or numbers.',
    password_minlength: (len) => `Password cannot be less than ${len} characters.`,
    password_maxlength: (len) => `Password cannot be greater than ${len} characters.`,
    password_not_match: 'The two passwords you typed do not match.',
    delete_confirm: 'Delete Confirmation',
    delete_user_confirm: (user) => `Are you sure you want to delete account ${user.username}?`,
    deleted_user: (user) => `Account ${user.username} deleted successfully.`,
    user_password_changed: (user) => `Password changed successfully.`,
    edit_user: 'Edit User',
    person_info: 'Personal profile',
    edit_profile: 'Edit profile',
    edit_password: 'Change password',
    movebankSetting: 'MoveBank Setting',
    movebank_notice1: "All historical data will be synchronized automatically after the configuration is applied.",
    movebank_notice2: "After the change, historical data cannot be synchronized to the new account.",
    movebank_notice3: "New account can only view the data generated after the configuration is applied.",
    movebank_notice4: "The data of historical movebank account will not be deleted.",
    click_to_set: "Click here to set",
    movebank_daily_notice: "*Synchronize data daily to MoveBank",
    movebank_confirm_username: "Please confirm the MoveBank username:",
    movebank_channge_username: "New MoveBank username:",
    movebank_change_notice_1: 'After the change,',
    movebank_change_notice_2: 'the historical data cannot be synchronized to the new account',
    movebank_change_notice_3: '. only the data generated after the configuration is applied can be viewed. Continue?',
    movebank_confirm_notice_1: "Historical data will be synchronized automatically ",
    movebank_confirm_notice_2: "to this account only",
    movebank_confirm_notice_3: ". Confirm to synchronize to this account?",
    single: 'Single',
    multiple: 'Multiple',
    data: 'Data',
    date: 'Date',
    last_week: 'Last week',
    last_month: 'Last month',
    flight: 'Flight',
    activity_amount: 'Activity',
    speed: 'Speed',
    course: 'Azimuth',
    height: 'Height',
    altitude: 'Altitude',
    altitude2: 'Altitude',
    flight_altitude: 'Flight altitude',
    surface_height: 'Surface elevation',
    charging: 'Charging',
    voltage: 'Voltage',
    illumination: 'Light intensity',
    positioning: 'Positioning',
    positioning_duration: 'Positioning time',
    number_of_positioning_satellites: 'Positioning satellite qty.',
    internet_signal: 'Network signal',
    internet_signal_strength: 'Network sig. strength',
    sensor: 'Sensor',
    pressure: 'Air pressure',
    temperature: 'Temperature',
    humidity: 'Relative humidity',
    freedom_of_choice: 'Custom',
    select_month:'Please select month',
    select_week:'Please select week',
    enter_device_mark:'Enter device mark',
    average:'Average value',
    you_can_select_up_to_5_items_of_data: 'You can select up to five items.',
    you_can_choose_up_to_5_creatures: 'You can choose up to 5 creatures',
    please_select_a_device: 'Please select a device',
    please_select_the_type_of_data_you_want_to_display: 'Please select the type of data you want to display',
    only_5_types_of_display_are_supported_at_the_same_time: 'Only five items are allowed.',
    user_label: (user) => `User: ${user.username}`,
    device_count_label: (len) => `Device: ${len}`,
    sender_label: (sender) => `From: ${sender || '-'}`,
    goefence_count_label: (len) => `Geofence: ${len || 0}`,
    allocate_device: 'Allocate device',
    user_auth_updated: 'User authorization changed successfully',
    no_device: 'No device',
    selected_count: (selected, all) => `${selected}/${all} Selected`,
    remove_device_from_user_confirm: (device) => `Sure to remove device ${device.mark || device.uuid}?`,
    remove_device_from_user_success: (device) => `Device ${device.mark || device.uuid} removed successfully.`,
    add_device_to_user_success: (len) => `${len} device added successfully.`,
    other_setting: 'Other Settings',
    language: 'Language',
    timezone: 'Timezone',
    pagination: 'Pagination',
    page_size: '/page',
    mark_as_read: 'Mark as Read',
    message_type: 'Type',
    message_content: 'Content',
    view_detail: 'View Detail',
    device: 'Device',
    username: 'Username',
    add_filter: 'Add filter',
    to: 'To',
    fence_list: (len) => `GeoFence List(${len})`,
    create_fence: 'Add Geofence',
    fence_detail: 'Geofence Detail',
    edit_fence: 'Edit Geofence',
    view_fence: 'View Geofence',
    remove_fence: 'Remove Geofence',
    fence_device_count: (count) => `Device: ${count || 0}`,
    fence_notification_type: (type) => `Notification: ${notification[type] || '-'}`,
    delete_fence_confirm: (fenceName) => `Confirm to delete Geofence ${fenceName}?`,
    remove_fence_confirm: (fenceName) => `Confirm to remove Geofence ${fenceName}?`,
    delete_fence_success: (fenceName) => `Delete Geofence ${fenceName} successfully.`,
    remove_fence_success: (fenceName) => `Remove Geofence ${fenceName} successfully.`,
    edit_fence_success: (fenceName) => `Geofence ${fenceName} Updated.`,
    notification_type: 'Notification',
    fence_name: 'Geofence Name',
    radius: 'Radius',
    center: 'Center',
    acreage: 'Area',
    please_enter_fence_name: 'Please enter the fence name',
    please_draw_fence_range: 'Please draw a Geofence.',
    fence_acreage_exceed: 'Exceed the max limit of area of Geofence.',
    fence_created: (fenceName) => `Geofence ${fenceName} created successfully.`,
    left_top: 'Left top',
    right_bottom: 'Right bottom',
    circle: 'Round',
    round: 'Round',
    rectangle: 'Rectangle',
    polygon: 'Polygon',
    fence_max_acreage: (area) => `Maximum limited area of Geofence: ${area || ''}`,
    quick_search: 'Quick Search',
    ask_druid_to_retrieve_password: 'Please contact your administrator or Druid to reset password!',
    druid_phone: (phone) => `Phone/Fax: ${phone}`,
    druid_email: (email) => `Email: ${email}`,
    forget_password: 'Forget Password?',
    pro_settings: 'Personal Configuration',
    pro_settings_updated: 'Personal Configuration updated',
    switch: 'Switch',
    acquisition_type: 'Setting item',
    device_installation_time: 'Device installation time',
    show_cluster: 'Show Cluster',
    show_markers: 'Show Markers',
    marker_show_type: 'GPS fixes display',
    show_cluster_short: 'Cluster',
    show_markers_short: 'Markers',
    search_range: 'Range search',
    search_range_devices: 'Range search (Devices)',
    cancel_search_range: 'Cancel Search Range',
    reset_search_range_result: 'Reset search range',
    device_latest_loc: `Latest location`,//(valid,all)=> (${valid || 0}/${all || 0})
    countOfTotal: (valid, all) => `(${valid || 0}/${all || 0})`,
    search_range_result_count: (count) => `${(count || 0) > 2 ? count + ' devices' : (count || 0) + ' device'} found:`,
    search_result_count: (count) => `Found  ${(count || 0) > 2 ? count + ' devices' : (count || 0) + ' device'}:`,
    search_gps_result_count: (count) => `Found ${count || 0} ENV Data:`,
    device_path_type: (deviceName) => `Device track: ${deviceName}`,
    last_months_path: (number) => `Last ${number % 12 === 0 ? (number / 12 + ' year') : (number + ' months')}`,
    last_days_path: (number) => `Last ${number >= 30 ? (number / 30 + ' month') : (number + ' days')}`,
    path_time_range: `Time frame`,
    searchFilters: 'According to:',
    track_type: 'Track type',
    original_path: 'All Fixes',
    gps_path: 'GPS Fixes',
    gps_simple_path: 'GPS Tidy Track',
    sms_path: 'SMS Track',
    uploading_path: 'Uploading Track',
    gps_path_short: 'Complete',
    gps_simple_path_short: 'Simplified',
    sms_path_short: 'SMS',
    uploading_path_short: 'Uploading',
    dead_time: 'Presumed dead on:',
    select_read_message: 'Select read messages',
    select_unread_message: 'Select unread messages',
    after: 'After',
    before: 'Before',
    ascending: 'Ascending',
    descending: 'Descending',
    total_count: (total) => `${total || 0} in Total`,
    page_count: (total) => `${total || 0} Page of Total`,
    mark_messages_as_read: 'Mark selected notification as read',
    delete_message_success: `Delete message success.`,
    dead: 'Dead',
    alive: 'Alive',
    all: 'All',
    data_filter: 'Data Filter',
    device_state: 'State',
    adult: 'Adult',
    juvenile: 'Juvenile',
    female: 'Female',
    male: 'Male',
    measure_distance: 'Distance measurement',
    exit_measure: 'Clear measurement',
    last_fixes: 'Latest',
    historial_fixes: 'Historial',
    loading: 'Loading',
    string_pattern: 'Chinese，English characters, numbers and  "_" (1-50)',
    number_pattern: (min, max) => `Please enter ${min} - ${max} integer`,
    number_float_pattern: (min, max) => `Please enter ${min} - ${max} floating number (accurate to 0.01)`,
    length_pattern: (min, max) => `Length between ${min} - ${max}`,
    device_name: (type) => `${deviceNameOf[type]}`,
    new_edition: 'New Edition',
    device_type_name: 'Device Name',
    device_model: 'Device Model',
    operator: 'Operator',
    china_mobile: 'China Mobile',
    unicom: 'Unicom',
    show_analysis: 'Chart',
    show_data_list: 'Data',
    updated: 'Updated!',
    onShowingGrid: 'Shown Column',
    hiddenGrid: 'Hidden Column',
    uploading_time:'Uploading Time',
    acquisition_time:'Acquisition Time',
    activity_index:'Activity Index',
    chart_splitting:'Chart splitting',
    chart_merging:'Chart merging',
}

function getZoneName(offset) {
    let name;
    switch (offset) {
        case -720:
            name = "IDL";
            break;
        case -660:
            name = "MIT";
            break;
        case -600:
            name = "HST";
            break;
        case -570:
            name = "MSIT";
            break;
        case -540:
            name = "AKST";
            break;
        case -480:
            name = "PST";
            break;
        case -420:
            name = "MST";
            break;
        case -360:
            name = "CST";
            break;
        case -300:
            name = "EST";
            break;
        case -240:
            name = "AST";
            break;
        case -210:
            name = "NST";
            break;
        case -180:
            name = "SAT";
            break;
        case -120:
            name = "BRT";
            break;
        case -60:
            name = "CVT";
            break;
        case 0:
            name = "GMT/WET";
            break;
        case 60:
            name = "CET";
            break;
        case 120:
            name = "EET";
            break;
        case 180:
            name = "MSK";
            break;
        case 210:
            name = "IRT";
            break;
        case 240:
            name = "META";
            break;
        case 270:
            name = "AFT";
            break;
        case 300:
            name = "METB";
            break;
        case 330:
            name = "IDT";
            break;
        case 345:
            name = "NPT";
            break;
        case 360:
            name = "BHT";
            break;
        case 390:
            name = "MRT";
            break;
        case 420:
            name = "MST";
            break;
        case 480:
            name = "EAT";
            break;
        case 510:
            name = "KRT";
            break;
        case 540:
            name = "FET";
            break;
        case 570:
            name = "ACST";
            break;
        case 600:
            name = "AEST";
            break;
        case 630:
            name = "FAST";
            break;
        case 660:
            name = "VTT";
            break;
        case 690:
            name = "NFT";
            break;
        case 720:
            name = "PSTB";
            break;
        case 765:
            name = "CIT";
            break;
        case 780:
            name = "PSTC";
            break;
        case 840:
            name = "PSTD";
            break;
        default:
            break;
    }
    return name
}

function getNav(name) {
    let navName = name;
    switch (name) {
        case 'device_list':
            navName = 'Device List'
            break;
        case 'original_data':
            navName = 'Data Category'
            break;
        case 'env':
            navName = 'ENV Data'
            break;
        case 'bhv':
            navName = 'BHV Data'
            break;
        case 'device_setting':
            navName = 'Device Setting'
            break;
        case 'geofence':
            navName = 'GeoFence'
            break;
        case 'fence_list':
            navName = 'GeoFence List'
            break;
        case 'fence_of_device':
            navName = 'Device\'s GeoFence'
            break;
        case 'data_analysis':
            navName = 'Visualization'
            break;
        case 'user_manage':
            navName = 'Account Setup'
            break;
        case 'pro_setting':
            navName = 'User Center'
            break;
        case 'my_setting':
            navName = 'My Information'
            break;
        case 'web_setting':
            navName = 'My Setting'
            break;
        case 'push_notification':
            navName = 'Notification'
            break;
        default:
            break;
    }
    return navName;
}

// window['lang'] = EN
export default EN