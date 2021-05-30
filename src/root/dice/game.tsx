import { Cause, conse, Conse, Context } from 'whatsup'
import { action } from 'whatsup'
import { Area, AreaClickEvent } from './area'
import { AreaArmiesData, AreaOwnersData, GameData } from './generators'
import { GameMap } from './map'
import { Player } from './player'

export class Game extends Cause<JSX.Element> {
    readonly playerId: number
    readonly players: Player[]
    readonly map: GameMap
    readonly areaOwners: Conse<AreaOwnersData>
    readonly areaArmies: Conse<AreaArmiesData>
    readonly attackerArea: Conse<Area | null>
    readonly defenderArea: Conse<Area | null>
    readonly activePlayerId: Conse<number>

    constructor({ players, owners, armies, map }: GameData) {
        super()

        this.playerId = 1
        this.players = players.map((data, i) => new Player(data, (i + 1) as 1 | 2 | 3 | 4 | 5 | 6))
        this.map = new GameMap(map)
        this.areaOwners = conse(owners)
        this.areaArmies = conse(armies)
        this.attackerArea = conse(null)
        this.defenderArea = conse(null)
        this.activePlayerId = conse(1)
    }

    *getArmySizeByAreaId(areaId: number) {
        return (yield* this.areaArmies)[areaId]
    }

    *yiePlayerByAreaId(areaId: number) {
        const playerId = (yield* this.areaOwners)[areaId]

        for (const player of this.players) {
            if (player.id === playerId) {
                return player
            }
        }

        throw 'Can`t find player'
    }

    *yieAttakerArea() {
        return yield* this.attackerArea
    }

    *yieDefenderArea() {
        return yield* this.defenderArea
    }

    getPlayerByAreaId(areaId: number) {
        const owners = this.areaOwners.get() as AreaOwnersData
        const playerId = owners[areaId]

        for (const player of this.players) {
            if (player.id === playerId) {
                return player
            }
        }

        throw 'Can`t find player'
    }

    handleAreaClickEvent(e: AreaClickEvent) {
        const isMyTurn = this.activePlayerId.get() === this.playerId

        if (isMyTurn) {
            const areaOwner = this.getPlayerByAreaId(e.area.id)
            const isMyArea = areaOwner.id === this.playerId

            if (isMyArea) {
                action(() => {
                    this.attackerArea.set(e.area)
                    this.defenderArea.set(null)
                })
                return
            }

            const attackerArea = this.attackerArea.get() as Area | null
            const isDefendingCandidate =
                attackerArea && attackerArea.neighbors.has(e.area.id) && areaOwner.id !== this.playerId

            if (isDefendingCandidate) {
                this.defenderArea.set(e.area)
            }
        }
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
