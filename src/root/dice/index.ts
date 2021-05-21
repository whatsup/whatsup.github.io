import { render } from '@whatsup/jsx'
import { Game } from './game'
import { generateGame } from './generators'

const gameData = generateGame(5, 100)
const game = new Game(gameData)

render(game)
