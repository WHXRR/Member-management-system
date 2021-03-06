import request from "@/utils/request"

export default {
    //获取会员列表
    getList() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    //分页方法
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            url: `/member`,
            method: 'post',
            data: pojo
        })
    },
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get',
        })
    },
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    deleteById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        })
    }
}