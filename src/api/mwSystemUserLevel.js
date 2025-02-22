import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwSystemUserLevel',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwSystemUserLevel/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwSystemUserLevel',
    method: 'put',
    data
  })
}
