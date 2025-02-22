import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwSystemUserTask',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwSystemUserTask/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwSystemUserTask',
    method: 'put',
    data
  })
}
