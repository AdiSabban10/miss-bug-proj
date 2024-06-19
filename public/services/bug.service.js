const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    onDownloadPdf,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`)
        .then(res => res.data)
        .catch(console.log)
}

function remove(bugId) {
    return axios.delete(BASE_URL + `/${bugId}`)
        .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + '/' + bug._id, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: 0  }
}

function onDownloadPdf(){
    return axios.get(BASE_URL + '/download')
        .then(res => res.data)
}

