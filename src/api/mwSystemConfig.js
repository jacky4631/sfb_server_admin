import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwSystemConfig',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwSystemConfig/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwSystemConfig',
    method: 'put',
    data
  })
}

export function get() {
  return request({
    url: 'api/mwSystemConfig?size=500',
    method: 'get'
  })
}

