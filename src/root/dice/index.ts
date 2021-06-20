import { render } from '@whatsup/jsx'
import { Game } from './game'
import { generateGame } from './generators'

// let data

// try {
//     data = JSON.parse(localStorage.getItem('data')! || '<')
// } catch (e) {
//     data = generateGame(COLORS.length, 10)

//     localStorage.setItem('data', JSON.stringify(data))
// }

// console.log(data)

const gameData = generateGame(2, 4)
const game = new Game(gameData)

console.log(gameData)

render(game)
