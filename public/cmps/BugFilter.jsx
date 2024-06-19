const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [selectedLabels, setSelectedLabels] = useState([])

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: selectedLabels.join(',') }))
    }, [selectedLabels])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked ? '-1' : '1'
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }

    function handleLabelChange({ target }) {
        const label = target.name
        const isChecked = target.checked

        setSelectedLabels(prevLabels => {
            if (isChecked) {
                return [...prevLabels, label]
            } else {
                return prevLabels.filter(lbl => lbl !== label)
            }
        })
    }

    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }

    const { txt, severity, sortBy, sortDir } = filterByToEdit

    const availableLabels = ['critical', 'need-CR', 'dev-branch']

    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>

            <div>
                <label htmlFor="txt">Free text:</label>
                <input
                    value={txt}
                    onChange={handleChange}
                    name="txt"
                    id="txt"
                    type="text"
                    placeholder="By Text"
                />

                <label htmlFor="minSeverity">Min severity:</label>
                <input
                    value={severity}
                    onChange={handleChange}
                    type="number"
                    name="minSeverity"
                    id="minSeverity"
                    placeholder="By min Severity"
                />
            </div>

            <div>
                <h3>Labels:</h3>
                {availableLabels.map(label => (
                    <label key={label}>
                        <input
                            type="checkbox"
                            name={label}
                            checked={selectedLabels.includes(label)}
                            onChange={handleLabelChange}
                        />
                        {label}
                    </label>
                ))}
            </div>
            <div>
                <label htmlFor="sortBy">Sort by:</label>
                <select name="sortBy" value={sortBy} onChange={handleChange}>
                    <option value="">Select Sorting</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <label htmlFor="sortDir">Sort descending:</label>
                <input
                    type="checkbox"
                    name="sortDir"
                    id="sortDir"
                    checked={sortDir === '-1'}
                    onChange={handleChange}
                />

                <button onClick={() => onGetPage(-1)}>-</button>
                <span>{filterByToEdit.pageIdx + 1}</span>
                <button onClick={() => onGetPage(1)}>+</button>
            </div>




        </section>
    )
}