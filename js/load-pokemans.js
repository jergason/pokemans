import axios from 'axios'
import Bluebird from 'bluebird'

import {extend, curry} from 'lodash-fp'
import {composeP} from 'ramda'

import {promisify} from './utils'

export function getPokemans() {
  return getJSON('api/v1/pokedex/1/').then(res => res.pokemon)
}

export function loadPokemans(pokemans) {
  return Bluebird.map(pokemans, pokeman => getPokeman(pokeman.resource_uri))
}

function getJSON(uri) {
  return axios.get(`http://pokeapi.co/${uri}`).then(res => res.data)
}

let getHydratedPokeman = composeP(hydrateDescription, hydrateSprites, getJSON)

function getSprites(pokeman) {
  var sprites = pokeman.sprites
  return Bluebird.map(sprites, sprite => getJSON(sprite.resource_uri))
}

function hydrateSprites(pokeman) {
  return getSprites(pokeman).then(sprites => {
    pokeman.sprites = sprites
    return pokeman
  })
}

function hydrateDescription(pokeman) {
  if (!pokeman.descriptions || pokeman.descriptions.length == 0) {
    return Bluebird.resolve(pokeman)
  }
  return getJSON(pokeman.descriptions[0].resource_uri)
    .then(description => extend(pokeman, {description: description.description}))
}

let checkCache = curry(function(cache, uri) {
  if (cache[uri]) {
    return cache[uri]
  }
  return uri
})

function requestIfNotCached(uriOrPokeman) {
  if (typeof uriOrPokeman == 'string') {
    return getHydratedPokeman(uriOrPokeman)
  }
  return uriOrPokeman
}

let cache = curry(function(_cache, pokeman) {
  _cache[pokeman.resource_uri] = pokeman
  return pokeman
})

var pokecache = {}
export let getPokeman = composeP(cache(pokecache),
                          requestIfNotCached,
                          promisify(checkCache(pokecache)))
