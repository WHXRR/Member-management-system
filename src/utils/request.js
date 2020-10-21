import axios from 'axios'

// axios.get('/db.json').then(response => {
//     console.log(response.data);
// })
const request = axios.create({
    baseURL: '/dev-api',
    timeout: 5000
})

request.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

request.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})

export default request