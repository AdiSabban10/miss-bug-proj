import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))
  
  useEffect(() => {
    bugService.query(filterBy)
      .then(bugs => setBugs(bugs))
      .catch(err => console.log('err:', err))
  }, [filterBy])

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onAddBug() {
    const title = prompt('Bug title?')
    const description = prompt('Bug description?')
    const severity = +prompt('Bug severity?')
    const labelsInput = prompt('Bug labels (comma-separated)?')
    const labels = labelsInput ? labelsInput.split(',').map(lbl => lbl.trim()) : []

    const bug = {
        title,
        description,
        severity,
        labels
    }
    
    bugService.save(bug)
      .then((savedBug) => {
        // console.log('Added Bug', savedBug)
        setBugs(prevBugs => [...prevBugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
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

  function onDownloadPdf() {
    bugService.onDownloadPdf()
  }


  if (!bugs || !bugs.length) return (<h1>no bugs today</h1>)

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onDownloadPdf} >Download PDF</button>
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
