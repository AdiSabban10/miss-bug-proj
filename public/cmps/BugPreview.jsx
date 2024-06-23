

export function BugPreview({bug}) {

    return (
        <article>
            <h4>{bug.title}</h4>
            <h5>{bug.description}</h5>
            <h1>🐛</h1>
            {bug.creator && <h4>Creator: {bug.creator.fullname}</h4>}
            <p>Severity: <span>{bug.severity}</span></p>
        </article>
    )
}