import { Cause, conse, Conse, Context } from 'whatsup'
import { AreaClickEvent } from './area'
import { AreaArmiesData, AreaOwnersData, GameData } from './generators'
import { GameMap } from './map'
import { Player } from './player'

export class Game extends Cause<JSX.Element> {
    readonly players: Player[]
    readonly map: GameMap
    readonly areaOwners: Conse<AreaOwnersData>
    readonly areaArmies: Conse<AreaArmiesData>
    readonly selectedAreaId: Conse<number>

    constructor({ players, owners, armies, map }: GameData) {
        super()

        this.players = players.map((data, i) => new Player(data, (i + 1) as 1 | 2 | 3 | 4 | 5 | 6))
        this.map = new GameMap(map)
        this.areaOwners = conse(owners)
        this.areaArmies = conse(armies)
        this.selectedAreaId = conse(NaN)
    }

    *getArmySizeByAreaId(areaId: number) {
        return (yield* this.areaArmies)[areaId]
    }

    *getPlayerByAreaId(areaId: number) {
        const playerId = (yield* this.areaOwners)[areaId]

        for (const player of this.players) {
            if (player.id === playerId) {
                return player
            }
        }

        throw 'Can`t find player'
    }

    *getSelectedAreaId() {
        return yield* this.selectedAreaId
    }

    handleAreaClickEvent(e: AreaClickEvent) {
        this.selectedAreaId.set(e.area.id)
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)
        ctx.on(AreaClickEvent, (e) => this.handleAreaClickEvent(e))

        while (true) {
            yield yield* this.map
        }
    }
}

// function _Game (){
//     return <div className={}>
// }
