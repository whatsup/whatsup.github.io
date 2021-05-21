const MIN_AREA_SIZE = 9
const MAX_AREA_SIZE = 15
const DIRECTIONS = [
    [
        [-1, -1],
        [+0, -1],
        [+1, +0],
        [+0, +1],
        [-1, +1],
        [-1, +0],
    ],
    [
        [+0, -1],
        [+1, -1],
        [+1, +0],
        [+1, +1],
        [+0, +1],
        [-1, +0],
    ],
]

/* Types */

class FewFreeCellsToCreateAnArea extends Error {}

type Cell = {
    x: number
    y: number
    freeNeighborsCount: number
}

type Area = {
    id: number
    cells: Cell[]
}

type Store = {
    [k: number]: {
        [k: number]: Cell
    }
}

/* Cell */

function createCell(x: number, y: number) {
    const freeNeighborsCount = 0

    return { x, y, freeNeighborsCount } as Cell
}

function initCell(store: Store, x: number, y: number) {
    if (!(x in store)) {
        store[x] = {}
    }

    const cell = createCell(x, y)

    for (const [x, y] of iterateCellNeighborsCoords(cell)) {
        const neighbor = findCell(store, x, y)

        if (neighbor) {
            neighbor.freeNeighborsCount--
        } else {
            cell.freeNeighborsCount++
        }
    }

    return (store[x][y] = cell)
}

function* iterateCellNeighborsCoords(cell: Cell) {
    const parity = cell.y & 1

    for (const [ox, oy] of DIRECTIONS[parity]) {
        yield [cell.x + ox, cell.y + oy]
    }
}

function getCellFreeNeighborsCoords(store: Store, cell: Cell) {
    const result = [] as [number, number][]

    for (const [x, y] of iterateCellNeighborsCoords(cell)) {
        if (!findCell(store, x, y)) {
            result.push([x, y])
        }
    }

    return result
}

function isCellHasFreeNeighbors(cell: Cell) {
    return cell.freeNeighborsCount > 0
}

/* Area */

function createArea(id: number) {
    const cells = [] as Cell[]

    return { id, cells } as Area
}

function addCellToArea(area: Area, cell: Cell) {
    area.cells.push(cell)
}

function getAreaPerimeter(area: Area) {
    return area.cells.filter((cell) => isCellHasFreeNeighbors(cell))
}

/* Store */

function createStore() {
    return {} as Store
}

function findCell(store: Store, x: number, y: number) {
    if (x in store && y in store[x]) {
        return store[x][y]
    }

    return null
}

function* iterateCells(store: Store) {
    for (const nested of Object.values(store)) {
        for (const cell of Object.values(nested)) {
            yield cell
        }
    }
}

function getMapPerimeter(store: Store) {
    const result = [] as Cell[]

    for (const cell of iterateCells(store)) {
        if (isCellHasFreeNeighbors(cell)) {
            result.push(cell)
        }
    }

    return result
}

/* Utils */

function getRandomNumberFromRange(start: number, end: number) {
    return start + Math.round(Math.random() * (end - start))
}

function getRandomItemFromArray<T>(array: T[]) {
    const index = getRandomNumberFromRange(0, array.length - 1)

    return array[index]
}

function calculateCandidateWeight(candidate: Cell) {
    return (6 - candidate.freeNeighborsCount) ** 10
}

function getCandidateFromPerimeter(perimeter: Cell[]) {
    const max = perimeter.reduce((acc, cell) => acc + calculateCandidateWeight(cell), 0)
    const rnd = getRandomNumberFromRange(0, max)

    let offset = 0

    for (const cell of perimeter) {
        offset += calculateCandidateWeight(cell)

        if (offset >= rnd) {
            return cell
        }
    }

    throw 'error search perimeter candidate'
}

/* Generator */

export function generateMap(size: number) {
    const store = createStore()
    const areas = generateAreas(store, size)

    return pack(areas)
}

function generateAreas(store: Store, areasCount: number) {
    const areas = [] as Area[]

    let nextAreaId = 1

    while (areas.length < areasCount) {
        const area = createArea(nextAreaId++)
        const perimeter = getMapPerimeter(store)

        if (perimeter.length === 0) {
            const center = initCell(store, 0, 0)

            addCellToArea(area, center)
        } else {
            const from = getCandidateFromPerimeter(perimeter)
            const freeNeighborsCoords = getCellFreeNeighborsCoords(store, from)
            const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
            const candidate = initCell(store, x, y)

            addCellToArea(area, candidate)
        }

        try {
            const areaSize = getRandomNumberFromRange(MIN_AREA_SIZE, MAX_AREA_SIZE)

            generateArea(store, area, areaSize)
        } catch (e) {
            if (e instanceof FewFreeCellsToCreateAnArea) {
                nextAreaId--
                continue
            }

            throw e
        }

        areas.push(area)
    }

    return areas
}

function generateArea(store: Store, area: Area, areaSize: number) {
    while (area.cells.length < areaSize) {
        const perimeter = getAreaPerimeter(area)

        if (perimeter.length === 0) {
            throw new FewFreeCellsToCreateAnArea()
        }

        const from = getCandidateFromPerimeter(perimeter)
        const freeNeighborsCoords = getCellFreeNeighborsCoords(store, from)
        const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
        const candidate = initCell(store, x, y)

        addCellToArea(area, candidate)
    }
}

function calculateNormalizations(areas: Area[]) {
    let minX = NaN
    let maxX = NaN
    let minY = NaN
    let maxY = NaN

    for (const area of areas) {
        for (const cell of area.cells) {
            if (Number.isNaN(minX) || cell.x < minX) {
                minX = cell.x
            }
            if (Number.isNaN(maxX) || cell.x > maxX) {
                maxX = cell.x
            }
            if (Number.isNaN(minY) || cell.y < minY) {
                minY = cell.y
            }
            if (Number.isNaN(maxY) || cell.y > maxY) {
                maxY = cell.y
            }
        }
    }

    minY += minY % 2

    const width = maxX - minX
    const height = maxY - minY
    const offsetX = minX
    const offsetY = minY

    return [width, height, offsetX, offsetY]
}

/* Packer */

type PackedMap = {
    width: number
    height: number
    cells: PackedCells
}

type PackedCells = {
    [k: number]: {
        [k: number]: number
    }
}

function pack(areas: Area[]) {
    const [width, height, offsetX, offsetY] = calculateNormalizations(areas)
    const cells = packAreas(areas, offsetX, offsetY)

    return { width, height, cells } as PackedMap
}

function packAreas(areas: Area[], offsetX: number, offsetY: number) {
    const acc = {} as PackedCells

    for (const area of areas) {
        for (const cell of area.cells) {
            const x = cell.x - offsetX
            const y = cell.y - offsetY

            if (acc[x] === undefined) {
                acc[x] = {}
            }

            acc[x][y] = area.id
        }
    }

    return acc
}
