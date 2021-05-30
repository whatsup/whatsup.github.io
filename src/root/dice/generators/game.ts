import { generateMap, MapData } from './map'
import { getRandomItemFromArray, getRandomNumberFromRange } from './utils'

export type GameData = {
    players: PlayerData[]
    owners: AreaOwnersData
    armies: AreaArmiesData
    map: MapData
}

export type PlayerData = {
    id: number
    areas: number[]
}

export type ArmyData = {
    areaId: number
    size: number
}

export type AreaOwnersData = {
    [areaId: number]: number
}

export type AreaArmiesData = {
    [areaId: number]: number
}

export function generateGame(playersCount: number, maxAreasCount: number) {
    const areasCount = maxAreasCount - (maxAreasCount % playersCount)
    const map = generateMap(areasCount)
    const players = [] as PlayerData[]
    const areasIds = map.areas.map((area) => area.id)
    const playerAreasCount = areasCount / playersCount
    const playerDicesCount = playerAreasCount * 3
    const owners = {} as AreaOwnersData
    const armies = {} as AreaArmiesData

    for (let i = 1; i <= playersCount; i++) {
        const id = i
        const areas = [] as number[]

        for (let j = 0; j < playerAreasCount; j++) {
            const index = getRandomNumberFromRange(0, areasIds.length - 1)
            const areaId = areasIds[index]

            owners[areaId] = id
            areas.push(areaId)
            areasIds.splice(index, 1)
        }

        for (let n = 0; n < playerDicesCount; n++) {
            const areaId = getRandomItemFromArray(areas)

            if (areaId in armies) {
                armies[areaId]++
            } else {
                armies[areaId] = 1
            }
        }

        const player = { id, areas } as PlayerData

        players.push(player)
    }

    return { players, owners, armies, map } as GameData
}
