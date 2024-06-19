const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }

    function onGetPage(diff) {
        if(filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }

    const { txt, severity } = filterByToEdit
    
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>

            <label htmlFor="txt">free text:</label>
            <input
                value={txt}
                onChange={handleChange}
                name="txt"
                id="txt"
                type="text"
                placeholder="By Text"
            />

            <label htmlFor="minSeverity">min severity:</label>
            <input
                value={severity}
                onChange={handleChange}
                type="number"
                name="minSeverity"
                id="minSeverity"
                placeholder="By min Severity"
            />

            <button onClick={() => onGetPage(-1)}>-</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => onGetPage(1)}>+</button>
            
        </section>
    )
}