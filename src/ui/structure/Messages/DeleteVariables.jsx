export const DeleteVariables = (props) => {
  return (
    <>
      <span>
        Deleting the selected node(s) will orphan the following output variables:
      </span>

      <br />
      <br />

      <ul className="list-unstyled ms-3">
        {props.outputs.map((output, idx) =>
          <li key={idx}>
            <span className="text-danger me-2">"{output.varname}"</span>
            →
            <span className="ms-2">
              <span className="fw-bold">{
                [
                  ...new Set(
                    props.outputs.reduce((acc, o) => acc.concat(o.dependant_node_ids), [])
                  )
                ].length
              }</span> dependant node(s)</span>
          </li>
        )}
      </ul>

      <br />
      <br />

      <span className="fw-bold">Do you want to delete the references from all the node(s)</span>
    </>
  )
}
