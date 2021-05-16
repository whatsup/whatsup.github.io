const WORLD_RADIUS = 3 // Areas
const AREA_RADIUS = 2 // Cells
const AREA_SIZE_IN_CELLS = AREA_RADIUS * 2
const WORLD_SIZE_IN_AREAS = WORLD_RADIUS * 2
const WORLD_SIZE_IN_CELLS = WORLD_SIZE_IN_AREAS * AREA_SIZE_IN_CELLS

function getRandomValuesFromRange(rangeStart: number, rangeEnd: number, count: number) {
    const result = [] as number[]

    while (result.length < count) {
        const index = rangeStart + Math.floor(Math.random() * (rangeEnd - rangeStart))

        if (result.includes(index)) {
            continue
        }

        result.push(index)
    }

    return result
}

type Cells = { [k: number]: { [k: number]: number } }

export function generateWorldMap(playersCount: number) {
    const cells = {} as Cells
    const perimeterLength = WORLD_SIZE_IN_AREAS * 4 - 4
    const excessAreaCount = WORLD_SIZE_IN_AREAS ** 2 % playersCount
    const excessAreaIndexes = getRandomValuesFromRange(0, perimeterLength, excessAreaCount)
    const cellAreasMap = new Map<[number, number], number>()

    let areaIndex = 0
    let perimeterAreaIndex = 0

    for (let x = 0; x < WORLD_SIZE_IN_AREAS; x++) {
        for (let y = 0; y < WORLD_SIZE_IN_AREAS; y++) {
            if (x === 0 || y === 0 || x === WORLD_SIZE_IN_AREAS - 1 || y === WORLD_SIZE_IN_AREAS - 1) {
                perimeterAreaIndex++

                if (excessAreaIndexes.includes(perimeterAreaIndex)) {
                    continue
                }
            }

            const cellX = x * AREA_SIZE_IN_CELLS + 1 + Math.floor(Math.random() * (AREA_SIZE_IN_CELLS - 2))
            const cellY = y * AREA_SIZE_IN_CELLS + 1 + Math.floor(Math.random() * (AREA_SIZE_IN_CELLS - 2))

            setCellArea(cells, cellX, cellY, areaIndex)
            cellAreasMap.set([cellX, cellY], areaIndex)

            areaIndex++
        }
    }

    let completed: boolean

    do {
        completed = true

        const cellAreasMapCopy = new Map(cellAreasMap)
        const neiAreaMap = new Map<number, Set<number>>()

        for (const [[x, y], areaId] of cellAreasMapCopy) {
            if (!neiAreaMap.has(areaId)) {
                neiAreaMap.set(areaId, new Set())
            }

            for (const [nx, ny] of neighbors(x, y)) {
                const nAreaId = getCellArea(cells, nx, ny)

                if (nAreaId === null) {
                    setCellArea(cells, nx, ny, areaId)
                    cellAreasMap.set([nx, ny], areaId)
                } else {
                    neiAreaMap.get(areaId)!.add(nAreaId)
                }
            }
        }

        for (const val of neiAreaMap.values()) {
            if (val.size < 3) {
                completed = false
            }
        }
    } while (!completed)

    return cells
}

function setCellArea(cells: Cells, x: number, y: number, areaId: number) {
    if (cells[x] === undefined) {
        cells[x] = {}
    }

    cells[x][y] = areaId
}

function getCellArea(cells: Cells, x: number, y: number) {
    if (cells[x] === undefined || cells[x][y] === undefined) {
        return null
    }

    return cells[x][y]
}

const DIRECTIONS = [
    [+1, +0],
    [+0, -1],
    [-1, -1],
    [-1, +0],
    [-1, +1],
    [+0, +1],
]

function* neighbors(x: number, y: number) {
    for (const [ox, oy] of DIRECTIONS) {
        yield [x + ox, y + oy]
    }
}
