import fs from 'fs'
import Cryptr from 'cryptr'
import {utilService} from './util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 ||  'secret-puk-1234')
let users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}

function checkLogin({ username, password }) {
    var user = users.find(user => user.username === username && user.password === password)
    if (user)  {
        user = {
            _id : user._id,
            fullname : user.fullname,
            isAdmin : user.isAdmin,
        }
    }
    return Promise.resolve(user)
}

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    return Promise.resolve(user)
}

// function remove(userId) {
//     users = users.filter(user => user._id !== userId)
//     return _saveUsersToFile()
// }

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('User not found!')
    users.splice(idx, 1)
    return _saveUsersToFile()
}

function save(userToSave) {

    if (userToSave._id) {
        const idx = users.findIndex(user => user._id === userToSave._id)
        if (idx === -1) return Promise.reject('User not found!')
        
        users.splice(idx, 1, userToSave)
    } else {
        userToSave._id = utilService.makeId()
        users.unshift(userToSave)
    }
    return _saveUsersToFile()
        .then(() => userToSave)
}

// function save(user) {
//     user._id = utilService.makeId()
//     // TODO: severe security issue- attacker can post admins
//     users.push(user)
//     return _saveUsersToFile().then(() => user)

// }


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}