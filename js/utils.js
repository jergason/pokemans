import Bluebird from 'bluebird'
import {curry} from 'lodash-fp'

export function promisify(f) {
  return function(...args) {
    return Bluebird.resolve(f(...args))
  }
}

export let trace = curry(function(log, value) {
  console.log(log, value)
  return value
})
