// @flow

import {property, isEmpty, curry, compose, filter, get, map} from 'lodash-fp'
import {composeP} from 'ramda'
import {getPokemans, loadPokemans} from './load-pokemans'
import {promisify} from './utils'

getPokemans().then(startApp)

function startApp(pokemans) {
  let button = document.querySelector('.find-pokemans')
  let pokemanInput = document.querySelector('input.pokeman')
  button.addEventListener('click', function(event) {
    event.preventDefault()
    let pokemanName = pokemanInput.value
    composeP(renderPokemans, loadPokemans, promisify(getMatchingPokemans(pokemans)))(pokemanName)
  })
}


var getMatchingPokemans = curry(function(_pokemans, pokemanName) {
  let filterByName = compose(not, isEmpty, match(new RegExp(pokemanName.toLowerCase(), 'i')), property('name'))
  return filter(filterByName, _pokemans)
})


function getImageUri(pokeman) {
  var spriteUri = get('sprites[0].image', pokeman)
  if (spriteUri) {
    return `http://pokeapi.co/${spriteUri}`
  }
  return '/pokeball.png'
}

function renderPokeman(pokeman) {
  return `
    <div class="row">
      <div class="small-2 columns">
        <img src="${getImageUri(pokeman)}" alt="${pokeman.name}" />
      </div>
      <div class="small-10 columns">
        <ul>
          <li>Name: ${pokeman.name}</li>
          <li>HP: ${pokeman.hp}</li>
          <li>Attack: ${pokeman.sp_atk}</li>
          <li>Defense: ${pokeman.sp_def}</li>
          <li>Speed: ${pokeman.speed}</li>
          <li>Description: ${pokeman.description}</li>
        </ul>
      </div>
    </div>`
}

function not(a) {
  return !a
}

var match = curry(function(regexp, str) {
  let res = str.match(regexp)
  return res ? res : []
})

var renderToDOM = curry(function(selector, string) {
  let node = document.querySelector(selector)
  node.innerHTML = string
})

var renderPokemans = compose(renderToDOM('div.pokemans'), map(renderPokeman))
