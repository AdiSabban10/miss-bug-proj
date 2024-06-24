const { useState, useEffect } = React

import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserIndex() {
    const user = userService.getLoggedInUser()
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(users => setUsers(users))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load users')
            })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
          .then(() => {
            console.log('Deleted Succesfully!')
            setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
            showSuccessMsg('User removed')
          })
          .catch((err) => {
            console.log('Error from onRemoveUser ->', err)
            showErrorMsg('Cannot remove user')
          })
      }


    return (
        <main>
            <h1>Hello, {user.fullname}</h1>
            <h2>User List</h2>
            <ul className="user-list container">
                {users.map((user) => (
                    <li key={user._id}>
                        <h3>{user.fullname}</h3>
                        <button onClick={() => onRemoveUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </main>
    )
}