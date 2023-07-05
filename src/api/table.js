import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
//请求测试地址
export function getListbanner(params) {
  return request({
    url: '/banner/index',
    method: 'get',
    params
  })
}
//请求测试地址
export function delListbanner(params) {
  return request({
    url: '/banner/delete',
    method: 'get',
    params
  })
}
//请求测试地址
export function addbanner(params) {
  return request({
    url: '/banner/add',
    method: 'post',
    params
  })
}
//请求测试地址
export function echartsbanner(params) {
  return request({
    url: '/banner/echarts',
    method: 'post',
    params
  })
}
