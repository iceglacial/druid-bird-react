/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/15 0015.
 */
import React from 'react'
import { message } from 'antd'
import appStore from './../store/app_store'

let messageShow = appStore.language.statusMessage
function MessageHandle (err,type){
  let response = err.response;
  if(response){
    let status = err.response.status;
    switch (status){
      case 400:
        if(type === 'login'){
          message.error(messageShow[400][2]);
        }
        else if(type === 'password'){
          message.error(messageShow[400][1]);
        }
        else if(type === 'create_user'){
          message.error(messageShow[400][3]);
        }else{
          message.error(messageShow[400][0]);
        }
        break;
      case 401:
        if(type !== 'login'){
          message.error(messageShow[401]);
          appStore.logOut();
        }
        break;
      case 404:
        message.error(messageShow[status]);
        break;
      case 500:
        if(type === 'range_search'){
          message.error(messageShow[500][1]);
        }else{
          message.error(messageShow[500][0]);
        }
        break;
      case 403: case 502: case 503: case 504:
        message.info(messageShow[status]);
        break;
      default:
        break;
    }
  }else{
    console.log(err);
  }
}

export default MessageHandle