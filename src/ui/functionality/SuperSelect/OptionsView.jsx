import { useState } from "react";

import { Groups } from "./Groups";
import { Paginator } from "./Paginator";
import { OptionsFilter } from "./OptionsFilter";
import { LoadingIndicator } from "./LoadingIndicator";

export const OptionsView = (props) => {
  const { values, options, groups, loading, selectOption, filter, searchPattern } = props;
  const [filterValue, setFilterValue] = useState(searchPattern || "");

  return (
    <div className="optionsViewWrapper">
      {
        groups?.length && <Groups { ...props } />
      }

      <div className="optionsWrapper">
        <div className="spinnerWrapper">
          <i className="spinner"></i>
        </div>

        <OptionsFilter
          {...props}
          onChange={(value) => { // We're overriding the onChange in "props"
            filter(value);
            setFilterValue(value);
          }}
          value={filterValue}
        />

        <div className="options">
          {
            (loading || options.length > 0) ? (
              options.map((option, idx) => {
                return (
                  <div
                    key={`${option.value}-${idx}`}
                    className={`option ${values.includes(option.value) ? "active" : ""}`}
                    onClick={() => selectOption(option)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="rcaret"></div>
                      <div className="text-truncate">{option.label}</div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="option empty text-truncate text-muted">No items</div>
            )
          }
        </div>

        <div className="optionsActions">
          <LoadingIndicator {...props} />
          <Paginator {...props} />
        </div>
      </div>
    </div>
  )
}
