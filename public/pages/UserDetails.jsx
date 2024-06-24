const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { loggerService } from '../../services/logger.service.js'

export function UserDetails() {
    const [user, setUser] = useState(null)
    // const [user, setUser] = useState(userService.getLoggedInUser())
    // const user = userService.getLoggedInUser()
    
    const [bugs, setBugs] = useState([])
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadUserBugs()
    }, [])

    function loadUser() {
        userService.getById(userId)
            .then(user => {
                setUser(user)
            })
            .catch(err => {
                showErrorMsg('Cannot load user')
                navigate('/bug')
            })

    }
    

    function loadUserBugs() {
        // bugService.query({ userId: user._id })
        bugService.query()
            .then(bugs => {
                console.log('bugs:', bugs)
                const userBugs = bugs.filter(bug => bug.creator && bug.creator._id === userId)
                setBugs(userBugs)
                // setBugs(bugs)
                console.log('userBugs:', userBugs)
            })
            .catch(err => {
                showErrorMsg('Cannot load bugs')
                navigate('/bug')
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
                loadPageCount()
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then((savedBug) => {
                // console.log('Updated Bug:', savedBug)
                setBugs(prevBugs => prevBugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                ))
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }


    if (!user) return <h1>loadings....</h1>

    return (
        <div>
            <h3>User Details</h3>
            <h4>{user.fullname}</h4>
            <h5>Bugs Created by {user.fullname}:</h5>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            <button><Link to="/bug">Back to List</Link></button>
            { user.isAdmin && <button><Link to="/user">Users List</Link></button> }
        </div>
    )
}

