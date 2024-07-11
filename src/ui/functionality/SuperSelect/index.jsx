// I didn't like any of the available Dropdown libraries out there ¯\_(ツ)_/¯

import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import { util } from "@joint/core";

import { MainInput } from "./MainInput";
import { OptionsView } from "./OptionsView";
import { Notifications } from "./Notifications";
import { SelectionPreview } from "./SelectionPreview";

import { useClickAnywhere } from "@src/utils/react/useClickAnywhere";
import { useNoInitialTriggerEffect } from "@src/utils/react/useNoInitialTriggerEffect";

export const SuperSelect = forwardRef((props, ref) => {
  const {
    multi,
    values,
    notifications,
    groups,
    options,
    onChange,
    groupsDisallowUnselect,
    className,
    disabled,
    searchPattern: _searchPattern,
  } = props;

  const superSelectRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  // This is an integer instead of a boolean because there are cases in which
  // the options refetch might get triggered multiple times. Each trigger will
  // increase the state, while each fetch (either successfull or failed) will
  // decrease it. We're "loading" whenever this value is bigger than 0.
  const [loading, setLoading] = useState(0);
  const [group, setGroup] = useState(groups?.find?.(g => g.selected));
  const [searchPattern, setSearchPattern] = useState(_searchPattern || "");
  const [paginator, setPaginator] = useState({
    current: 1,
    pagingDetails: [],
    perPage: 10,
  });
  const [resolvedOptions, setResolvedOptions] = useState([]);

  // Escape hatch used to re-run the options getters.
  const [refreshOptionsEvent, _triggerRefreshOptionsEvent] = useState(0);
  const triggerRefreshOptionsEvent = useCallback(util.debounce(() => {
    _triggerRefreshOptionsEvent(n => n + 1);
  }, 50, {
    leading: false,
    trailing: true,
  }), []);
  //

  // Update the selected group if data gets updated from the parent. This is
  // required because there are situations in with the parent may pass an empty
  // array before passing the actual data (this happens when the data is fetched
  // asynchronously)...
  useNoInitialTriggerEffect(() => {
    // ... but once a group has been selected, the parent WON'T be able to
    // change it.
    if(!group) {
      setGroup(groups?.find?.(g => g.selected));
    }
    triggerRefreshOptionsEvent();
  }, [groups, options]);
  //

  // Handle clicks performed outside of the dropdown
  const handleClickOutside = useCallback((e) => {
    if(superSelectRef && !superSelectRef.current.contains(e.target)) {
      setToggle(false);
    }
  }, []);
  useClickAnywhere(handleClickOutside);
  //

  useImperativeHandle(ref, () => ({
    reloadOptions: () => triggerRefreshOptionsEvent(n => n + 1)
  }));

  useEffect(() => {
    setLoading(v => v + 1);
    Promise.all(options.map((fn, idx) => fn({
      searchPattern,
      page: paginator.current,
      perPage: paginator.perPage,
      group: group?.value,
      pagingDetails: paginator.pagingDetails[idx] || {
        // This object is an escape hatch. It can be used to store any
        // implementation-specific data, like a "prev" and a "next" tokens.
      },
    }))).then(results => {
      let _opts = []; // A place to store all the retrieved options
      const pagingDetails = [];

      results.forEach(result => {
        // "result" is the object returned by the "process()" method of the
        // autocompleter. The "data" property contains the array of options.
        // Any other properties will be stored in the "pagingDetails" object,
        // which will then be passed to any future invocations of the same
        // autocompleter.
        _opts = _opts.concat(result.data);
        delete result.data;
        pagingDetails.push(result);
      });

      setPaginator({ ...paginator, pagingDetails });
      setResolvedOptions(_opts);
      setLoading(v => v - 1);
    });
  }, [refreshOptionsEvent]);

  // Fns that will be passed to child components
  const addValue = ({ idx, value }) => {
    if(values.includes(value)) return;
    values.splice(idx, 0, value);
    onChange(values);
  };

  const updateValue = ({ idx, value }) => {
    if(!value) {
      deleteValue({ idx });
      return;
    }
    values[idx] = value;
    onChange(values);
  }

  const deleteValue = ({ idx }) => {
    values.splice(idx, 1);
    onChange(values);
  }

  const filter = useCallback(util.debounce((text) => {
    setPaginator({ ...paginator, current: 1 });
    setSearchPattern(text);
    triggerRefreshOptionsEvent();
  }, 450, {
    leading: false,
    trailing: true,
  }), []);

  const selectGroup = (_group) => {
    if(_group.value === group?.value) {
      if(groupsDisallowUnselect) {
        return;
      }

      setGroup(null);
    } else {
      setGroup(_group);
    }

    setPaginator({ ...paginator, current: 1 });
    triggerRefreshOptionsEvent();
  };

  const selectOption = (option) => {
    if(values.includes(option.value)) {
      if(multi) {
        onChange(values.filter(v => v !== option.value));
      }
    } else {
      if(multi) {
        onChange([...values, option.value]);
      } else {
        onChange([option.value]);
      }
    }

    if(!multi) {
      setToggle(false);
    }
  };

  const goFirstPage = () => {
    setPaginator({ ...paginator, current: 1 });
    triggerRefreshOptionsEvent();
  };

  const goPrevPage = () => {
    setPaginator({ ...paginator, current: paginator.current - 1 });
    triggerRefreshOptionsEvent();
  };

  const goNextPage = () => {
    setPaginator({ ...paginator, current: paginator.current + 1 });
    triggerRefreshOptionsEvent();
  };

  const goLastPage = () => {
    setPaginator({
      ...paginator,
      current: paginator.pagingDetails.reduce(
        (acc, o) => Math.max(o.total, acc),
        0
      ),
    });
    triggerRefreshOptionsEvent();
  };
  //

  return (
    <div
      ref={superSelectRef}
      className={`
        superselect
        ${className}
        ${values.length > 0 ? "hasSelections" : ""}
        ${multi ? "" : "singleSelect"}
        ${toggle ? "open" : ""}
        ${notifications ? "hasNotifications" : ""}
        ${loading ? "loading" : ""}
        ${disabled ? "disabled" : ""}
      `}
    >
      {/* This is the main input */}
      <MainInput
        addValue={addValue}
        updateValue={updateValue}
        deleteValue={deleteValue}
        onClick={() => setToggle(!toggle)}
        { ...props }
        options={resolvedOptions} // We're overriding the "options" property in "props"
      />

      <div className={`
        position-absolute w-100 start-0
        ${toggle ? "shadow rounded-bottom z-5" : ""}
      `}>
        {
          multi && (
            <SelectionPreview
              updateValue={updateValue}
              deleteValue={deleteValue}
              { ...props }
              options={resolvedOptions} // We're overriding the "options" property in "props"
            />
          )
        }

        <OptionsView
          filter={filter}
          loading={loading}
          paginator={paginator}
          group={group}
          selectGroup={selectGroup}
          selectOption={selectOption}
          goFirstPage={goFirstPage}
          goPrevPage={goPrevPage}
          goNextPage={goNextPage}
          goLastPage={goLastPage}
          { ...props }
          searchPattern={searchPattern} // We're overriding the "searchPattern" property in "props"
          options={resolvedOptions} // We're overriding the "options" property in "props"
        />

        <Notifications { ...props } />
      </div>
    </div>
  )
});
