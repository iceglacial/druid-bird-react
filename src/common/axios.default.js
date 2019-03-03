/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/7 0007.
 */
import axios from 'axios';
import apiRoot from './api.root'
import Token from './../common/token'

let token = Token.getLocalToken();
var axiosDefault = axios.create({
    baseURL: apiRoot.getApiRoot(),
    headers: {
        'x-druid-authentication': token
    }
    /* other custom settings */
});
// console.log(authStore&&authStore.token ,authStore && authStore.getToken(),storage);
export default axiosDefault;