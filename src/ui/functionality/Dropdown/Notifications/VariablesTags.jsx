import Badge from "react-bootstrap/esm/Badge";

export const VariablesTags = (props) => {
  const { expected_vars_filter } = props;

  return (
    <div className="d-flex w-100 flex-gap-1 p-1 align-items-center justify-content-start flex-wrap">
      {
        expected_vars_filter.map((v, idx) => (
          <div className="d-flex" key={idx}>
            {
              v.type ? (
                <>
                  <Badge className={`${v.type.split(":")[0]} fill border border-transparent variable_badge text-smallest rounded-end-0 user-select-none`}>
                    {v.type.split(":")[0]}
                  </Badge>
                  <Badge className={`${v.type.split(":")[0]} badge-transparent border variable_badge text-smallest rounded-start-0 user-select-none`}>
                    {v.type.split(":")[1]}
                  </Badge>
                </>
              ) : v.capability ? (
                <Badge className={`bg-success border capability_badge text-smallest user-select-none`}>
                  {v.capability}
                </Badge>
              ) : ""
            }
          </div>
        ))
      }
    </div>
  )
}
