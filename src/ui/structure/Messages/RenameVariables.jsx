export const RenameVariables = (props) => {
  return (
    <>
      <span>
        Saving the settings will cause a change in the following output variables:
      </span>

      <br />
      <br />

      <ul className="list-unstyled ms-3">
        {props.outputs.map((output, idx) =>
          <li key={idx}>
            <span className="text-danger me-2">"{output.old}"</span>
            →
            <span className="text-success ms-2">"{output.new}"</span>
          </li>
        )}
      </ul>

      <span>
        There are <span className="fw-bold">{
          [
            ...new Set(
              props.outputs.reduce((acc, o) => acc.concat(o.dependant_node_ids), [])
            )
          ].length
        }</span> node(s) that are using some or all of these output variables.
      </span>

      <br />
      <br />

      <span className="fw-bold">
        Do you want to propagate the changes to all the node(s)
        that are referencing the modified output variables?
      </span>
    </>
  )
}
