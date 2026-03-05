import request from '@/utils/request'

export function getUserList(data) {
    const url = '/getUser/api/pageQueryUserList'
    return request({
        url: url,
        method: 'get',
        params: data
    })
}