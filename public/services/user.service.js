const BASE_URL = '/api/user'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    query,
    getById,
    remove,
    save,
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials
}

function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + `/${userId}`)
        .then(res => res.data)
}

function remove(userId) {
    return axios.delete(BASE_URL + `/${userId}`)
        .then(res => res.data)
}

function save(user) {
    const method = user._id ? 'put' : 'post'
    return axios[method](BASE_URL, user)
        .then(res => res.data)
    
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

