const { useState, useEffect } = React

export function BugFilter({ filterBy, setFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    // useEffect(() => {
    //     setFilterBy(filterByToEdit)
    // }, [filterByToEdit])

    function onSubmitForm(ev){
        ev.preventDefault()
        setFilterBy(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value || '' : target.value
        setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
    }


    const { txt, severity } = filterByToEdit
    // const { txt, severity } = filterBy
    return (
        <section className="bug-filter full main-layout">
            <h2>Filter Our Bugs</h2>

            <form onSubmit={onSubmitForm}>
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
                <button>submit</button>

             
            </form>
        </section>
    )
}