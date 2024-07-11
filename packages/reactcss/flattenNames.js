import { map, forOwn, isString, isPlainObject } from "lodash-es";

export const flattenNames = (things = []) => {
  const names = []

  map(things, (thing) => {
    if (Array.isArray(thing)) {
      flattenNames(thing).map(name => names.push(name))
    } else if (isPlainObject(thing)) {
      forOwn(thing, (value, key) => {
        value === true && names.push(key)
        names.push(`${ key }-${ value }`)
      })
    } else if (isString(thing)) {
      names.push(thing)
    }
  })

  return names
}

export default flattenNames
