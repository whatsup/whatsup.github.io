import { Cause, Context } from 'whatsup'
import { COLORS } from './constants'
import { GameData } from './generators'
import { GameMap } from './map'
import { Player } from './player'

export class Game extends Cause<JSX.Element> {
    readonly players: Player[]
    readonly map: GameMap

    constructor({ players, map }: GameData) {
        super()

        this.players = players.map((data, i) => new Player(data, COLORS[i]))
        this.map = new GameMap(map)
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)

        while (true) {
            yield yield* this.map
        }
    }
}
