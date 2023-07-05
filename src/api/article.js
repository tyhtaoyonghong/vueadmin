import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
//请求测试地址
export function getListarticle(params) {
  return request({
    url: '/article/index',
    method: 'get',
    params
  })
}
//请求测试地址
export function delListarticle(params) {
  return request({
    url: '/article/delete',
    method: 'get',
    params
  })
}
//请求测试地址
export function addarticle(params) {
  return request({
    url: '/article/add',
    method: 'post',
    params
  })
}
//请求测试地址
export function echartsarticle(params) {
  return request({
    url: '/article/echarts',
    method: 'post',
    params
  })
}
