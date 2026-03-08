import request from '@/utils/request'

export function getUserList(data) {
    const url = '/getUser/api/pageQueryUserList'
    return request({
        url: url,
        method: 'get',
        params: data
    })
}

export function addUser(data) {
    const url = '/getUser/api/addUser'
    return request({
        url: url,
        method: 'post',
        data: data
    })
}

export function modifyUser(data) {
    const url = '/getUser/api/modifyUser'
    return request({
        url: url,
        method: 'post',
        data: data
    })
}