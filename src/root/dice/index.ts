import { render } from '@whatsup/jsx'
import { COLORS } from './constants'
import { Game } from './game'
import { generateGame } from './generators'

const gameData = generateGame(COLORS.length, 11)
const game = new Game(gameData)

render(game)
