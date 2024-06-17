const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    onDownloadPdf,
}

function query(filterBy) {
    const {txt , minSeverity = +minSeverity} = filterBy
    return axios.get(`${BASE_URL}?txt=${txt}&minSeverity=${minSeverity}`)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`)
        .then(res => res.data)
        .catch(console.log)
}

function remove(bugId) {
    return axios.get(BASE_URL + `/${bugId}/remove`)
        .then(res => res.data)
}

function save(bug) {
    const { _id , title, description , severity, createdAt } = bug
    if (bug._id) {
        return axios.get(BASE_URL + `/save?_id=${_id}&title=${title}&description=${description}&severity=${severity}&createdAt=${createdAt}`)
            .then(res => res.data)
    } else {
        return axios.get(BASE_URL + `/save?title=${title}&description=${description}&severity=${severity}`)
            .then(res => res.data)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function onDownloadPdf(){
    return axios.get(BASE_URL + '/download')
        .then(res => res.data)
}

