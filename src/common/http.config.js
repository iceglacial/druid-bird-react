/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/20 0020.
 */
import token from './token'

const httpConfig = (sort, limit, offset, params) => {
  let _headers = {'x-druid-authentication': token.getLocalToken()};
  sort && Object.assign(_headers, {'x-result-sort': sort});
  limit && Object.assign(_headers, {'x-result-limit': limit});
  offset && Object.assign(_headers, {'x-result-offset': offset});
  let config = {
    headers: _headers,
    timeout: 60000,
  }
  params && Object.assign(config, {params: params})
  // console.log(config)
  return config;
}
export default httpConfig