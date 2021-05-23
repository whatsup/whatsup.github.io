import { render } from '@whatsup/jsx'
import { COLORS } from './constants'
import { Game } from './game'
import { generateGame } from './generators'

let data

try {
    data = JSON.parse(localStorage.getItem('data')! || '<')
} catch (e) {
    data = generateGame(COLORS.length, 11)

    localStorage.setItem('data', JSON.stringify(data))
}

console.log(data)

const gameData = generateGame(COLORS.length, 110)
const game = new Game(gameData)

render(game)
