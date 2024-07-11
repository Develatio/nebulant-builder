export const Groups = (props) => {
  const { group, groups, selectGroup } = props;

  const refs = {};

  setTimeout(() => {
    refs[group?.value]?.scrollIntoView?.({
      block: 'nearest',
    });
  })

  return (
    <div className="groupsWrapper">
      {
        groups.map((_group) => {
          return (
            <div
              key={_group.value}
              ref={ref => refs[_group.value] = ref}
              className={`group ${_group.value === group?.value ? "active" : ""}`}
              onClick={() => selectGroup(_group)}
            >
              <div className="rcaret"></div>
              <div className="text-truncate d-block w-100 me-2">
                {_group.label}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
