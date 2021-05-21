import { generateMap, MapData } from './map'
import { getRandomNumberFromRange } from './utils'

export type GameData = {
    players: PlayerData[]
    map: MapData
}

export type PlayerData = {
    id: number
    areas: number[]
}

export function generateGame(playersCount: number, maxAreasCount: number) {
    const areasCount = maxAreasCount - (maxAreasCount % playersCount)
    const map = generateMap(areasCount)
    const players = [] as PlayerData[]
    const areasIds = map.areas.map((area) => area.id)
    const playerAreasCount = areasCount / playersCount

    for (let i = 1; i <= playersCount; i++) {
        const id = i
        const areas = [] as number[]

        for (let j = 0; j < playerAreasCount; j++) {
            const index = getRandomNumberFromRange(0, areasIds.length - 1)

            areas.push(areasIds[index])
            areasIds.splice(index, 1)
        }

        const player = { id, areas } as PlayerData

        players.push(player)
    }

    return { players, map } as GameData
}
