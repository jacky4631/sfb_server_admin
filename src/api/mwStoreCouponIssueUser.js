import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreCouponIssueUser',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreCouponIssueUser/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreCouponIssueUser',
    method: 'put',
    data
  })
}
