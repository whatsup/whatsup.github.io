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

type Cell = {
    x: number
    y: number
    freeNeighborsCount: number
}

type Cells = { [k: number]: { [k: number]: Cell } }

function createCell(x: number, y: number) {
    const freeNeighborsCount = 0

    return { x, y, freeNeighborsCount } as Cell
}

let AREA_ID = 1

type Area = {
    id: number
    cells: Cell[]
}

function createArea() {
    const id = AREA_ID++
    const cells = [] as Cell[]

    return { id, cells } as Area
}

function initCell(cells: Cells, x: number, y: number) {
    if (!(x in cells)) {
        cells[x] = {}
    }

    const cell = createCell(x, y)

    for (const [x, y] of cellNeighborsCoords(cell)) {
        const neighbor = findCell(cells, x, y)

        if (neighbor) {
            neighbor.freeNeighborsCount--
        } else {
            cell.freeNeighborsCount++
        }
    }

    return (cells[x][y] = cell)
}

function findCell(cells: Cells, x: number, y: number) {
    if (x in cells && y in cells[x]) {
        return cells[x][y]
    }

    return null
}

function* cellNeighborsCoords(cell: Cell) {
    const parity = cell.y & 1

    for (const [ox, oy] of DIRECTIONS[parity]) {
        yield [cell.x + ox, cell.y + oy]
    }
}

function getCellFreeNeighborsCoords(cells: Cells, cell: Cell) {
    const result = [] as [number, number][]

    for (const [x, y] of cellNeighborsCoords(cell)) {
        if (!findCell(cells, x, y)) {
            result.push([x, y])
        }
    }

    return result
}

function isCellHasFreeNeighbors(cell: Cell) {
    return cell.freeNeighborsCount > 0
}

function* iterateCells(cells: Cells) {
    for (const nested of Object.values(cells)) {
        for (const cell of Object.values(nested)) {
            yield cell
        }
    }
}

function getWorldPerimeter(cells: Cells) {
    const result = [] as Cell[]

    for (const cell of iterateCells(cells)) {
        if (isCellHasFreeNeighbors(cell)) {
            result.push(cell)
        }
    }

    return result
}

function expandWorld(cells: Cells, areas: Area[], size: number) {
    while (areas.length < size) {
        const area = createArea()
        const perimeter = getWorldPerimeter(cells)

        if (perimeter.length === 0) {
            const center = initCell(cells, 0, 0)

            addCellToArea(area, center)
        } else {
            const from = getCandidateFromPerimeter(perimeter)
            const freeNeighborsCoords = getCellFreeNeighborsCoords(cells, from)
            const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
            const candidate = initCell(cells, x, y)

            addCellToArea(area, candidate)
        }

        try {
            const size = getRandomNumberFromRange(10, 15)

            expandArea(cells, area, size)
        } catch (e) {
            continue
        }

        areas.push(area)
    }
}

function calculateNormalizationOffsets(areas: Area[]) {
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

    const offsetX = Math.floor((Math.abs(minX) - Math.abs(maxX)) / 2)
    const rawOffsetY = Math.floor((Math.abs(minY) - Math.abs(maxY)) / 2)
    const offsetY = rawOffsetY + (rawOffsetY % 2)

    return [offsetX, offsetY]
}

function getRandomNumberFromRange(start: number, end: number) {
    return start + Math.round(Math.random() * (end - start))
}

function getRandomItemFromArray<T>(array: T[]) {
    const index = getRandomNumberFromRange(0, array.length - 1)

    return array[index]
}

function expandArea(cells: Cells, area: Area, size: number) {
    while (area.cells.length < size) {
        const perimeter = getAreaPerimeter(area)

        if (perimeter.length === 0) {
            throw 'Cannot expand area'
        }

        const from = getCandidateFromPerimeter(perimeter)
        const freeNeighborsCoords = getCellFreeNeighborsCoords(cells, from)
        const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
        const candidate = initCell(cells, x, y)

        addCellToArea(area, candidate)
    }
}

function addCellToArea(area: Area, cell: Cell) {
    area.cells.push(cell)
}

function getAreaPerimeter(area: Area) {
    return area.cells.filter((cell) => isCellHasFreeNeighbors(cell))
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

function pack(areas: Area[]) {
    const acc = {} as { [k: number]: { [k: number]: number } }
    const [offsetX, offsetY] = calculateNormalizationOffsets(areas)

    for (const area of areas) {
        for (const cell of area.cells) {
            const x = cell.x + offsetX
            const y = cell.y + offsetY

            if (acc[x] === undefined) {
                acc[x] = {}
            }

            acc[x][y] = area.id
        }
    }

    return acc
}

function createCellsStore() {
    return {} as Cells
}

function createAreasStore() {
    return [] as Area[]
}

export function generateMap() {
    const cells = createCellsStore()
    const areas = createAreasStore()

    expandWorld(cells, areas, 24)

    return pack(areas)
}
