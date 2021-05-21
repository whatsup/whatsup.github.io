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
    area: Area
    freeNeighborsCount: number
}

type Area = {
    id: number
    cells: Cell[]
    neighbors: Area[]
}

type Store = {
    [k: number]: {
        [k: number]: Cell
    }
}

/* Cell */

function createCell(x: number, y: number, area: Area) {
    const freeNeighborsCount = 0

    return { x, y, area, freeNeighborsCount } as Cell
}

function initCell(store: Store, x: number, y: number, area: Area) {
    if (!(x in store)) {
        store[x] = {}
    }

    const cell = createCell(x, y, area)

    for (const [x, y] of iterateCellNeighborsCoords(cell)) {
        const neighbor = findCell(store, x, y)

        if (neighbor) {
            setAreaRelations(area, neighbor.area)
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
    const neighbors = [] as Area[]

    return { id, cells, neighbors } as Area
}

function addCellToArea(area: Area, cell: Cell) {
    area.cells.push(cell)
}

function getAreaPerimeter(area: Area) {
    return area.cells.filter((cell) => isCellHasFreeNeighbors(cell))
}

function setAreaRelations(one: Area, two: Area) {
    one.neighbors.push(two)
    two.neighbors.push(one)
}

function destroyAreaRelation(area: Area) {
    for (const neighbor of area.neighbors) {
        const index = neighbor.neighbors.indexOf(area)
        neighbor.neighbors.splice(index, 1)
    }

    area.neighbors.length = 0
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

function findStartAreaCell(store: Store, area: Area) {
    const perimeter = getMapPerimeter(store)

    if (perimeter.length === 0) {
        return initCell(store, 0, 0, area)
    }

    const from = getCandidateFromPerimeter(perimeter)
    const freeNeighborsCoords = getCellFreeNeighborsCoords(store, from)
    const [x, y] = getRandomItemFromArray(freeNeighborsCoords)

    return initCell(store, x, y, area)
}

function generateAreas(store: Store, areasCount: number) {
    const areas = [] as Area[]

    let nextAreaId = 1

    while (areas.length < areasCount) {
        try {
            const id = nextAreaId++
            const size = getRandomNumberFromRange(MIN_AREA_SIZE, MAX_AREA_SIZE)
            const area = generateArea(store, id, size)

            areas.push(area)
        } catch (e) {
            if (e instanceof FewFreeCellsToCreateAnArea) {
                nextAreaId--
                continue
            }

            throw e
        }
    }

    return areas
}

function generateArea(store: Store, id: number, size: number) {
    const area = createArea(id)
    const start = findStartAreaCell(store, area)

    addCellToArea(area, start)

    while (area.cells.length < size) {
        const perimeter = getAreaPerimeter(area)

        if (perimeter.length === 0) {
            destroyAreaRelation(area)
            throw new FewFreeCellsToCreateAnArea()
        }

        const from = getCandidateFromPerimeter(perimeter)
        const freeNeighborsCoords = getCellFreeNeighborsCoords(store, from)
        const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
        const candidate = initCell(store, x, y, area)

        addCellToArea(area, candidate)
    }

    return area
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

type PackedArea = {
    id: number
    neighbors: number[]
    cells: PackedAreaCells
}

function packArea(area: Area, offsetX: number, offsetY: number) {
    const id = area.id
    const neighbors = packAreaNeighbors(area)
    const cells = packAreaCells(area, offsetX, offsetY)

    return { id, neighbors, cells } as PackedArea
}

type PackedAreaCells = {
    [k: number]: number[]
}

function packAreaCells(area: Area, offsetX: number, offsetY: number) {
    const cells = {} as PackedAreaCells

    for (const cell of area.cells) {
        const x = cell.x - offsetX
        const y = cell.y - offsetY

        if (cells[x] === undefined) {
            cells[x] = []
        }

        cells[x][y] = area.id
    }

    return cells
}

function packAreaNeighbors(area: Area) {
    return area.neighbors.map((neighbor) => neighbor.id)
}
