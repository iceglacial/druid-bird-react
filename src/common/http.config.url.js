/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/20 0020.
 */
import token from './token'

const httpConfig = (sort, limit, offset, params) => {
  let _params = {
    'sort': sort&&encodeURIComponent(sort),
    'limit': limit&&encodeURIComponent(limit),
    'offset': offset&&encodeURIComponent(offset),
    'authentication': encodeURIComponent(token.getLocalToken())
  }
  let config = {
    timeout: 60000,
    params: Object.assign(_params, params)
  }
  return config;
}
export default httpConfig