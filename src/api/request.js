/**
 *   @description 接口请求拦截
 *   @author O
 *   @date 2022/01/28
 */
import axios from 'axios'
import { Message } from 'element-ui';
import config from './config';
// 创建一个axios实例
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    baseURL: config.baseUrl,
    timeout: 30000, // 请求超时时间 默认30秒
    method: 'POST',
    responseType:'json',
    headers: {
        // 'Content-Type': 'text/plain'
        'Content-Type': 'text/plain'
        ///
    }
})
// 请求拦截器
service.interceptors.request.use(config => {
    if (config.data && (config.data.hasOwnProperty("txt_file") || config.data.hasOwnProperty("file")  )) {
        config.headers = {
            'Content-Type': "multipart/form-data; boundary=----WebKitFormBoundaryfCW2CibjyRZ0bANa"
        }
    }
    // config.method = 'POST';
    const token = sessionStorage.getItem('userToken');
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
        let url = config.url;
        url += url.indexOf('?') >= 0 ? '&' : '?';
        url += `&token=${token}`;
        config.url = url;
    }
    return config
},
    error => {
        console.log('请求error: ', error);
        // debug
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 0) {
            Message.warning(res.msg || 'Error')
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('error.message---响应拦截器 ', error.message);
        if (error.message === 'Network Error') {
           Message.warning('网络错误')
        } else if (error.message.indexOf('timeout of') > -1) {
           Message.warning('请求超时')
        } else if (error.message === 'Client error') {
           Message.warning('浏览器错误')
        } else if (error.message === 'Server error') {
           Message.warning("服务器异常") 
        } else {
           Message.warning(error.message)
        }
        return Promise.reject(error)
    }
)

export default service
