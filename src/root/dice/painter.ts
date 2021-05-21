import { DIRECTIONS } from './constants'
import { PackedAreaCells } from './generator'

//prettier-ignore
const POINTS = [
    [-0.5, -0.2],
    [   0, -0.5],
    [ 0.5, -0.2],
    [ 0.5,  0.2],
    [   0,  0.5],
    [-0.5,  0.2],
]

function isCoordsBelongsToArea(cells: PackedAreaCells, x: number, y: number) {
    if (!(x in cells)) {
        return false
    }
    return cells[x].includes(y)
}

function createPoint(x: number, y: number, direction: number): string {
    const [ox, oy] = POINTS[direction]
    const px = x + ox + (y % 2) * 0.5
    const py = y * 0.7 + oy

    return `${px},${py}`
}

function turn(direction: number, angle: number) {
    direction += angle
    direction %= 6

    if (direction < 0) {
        direction += 6
    }

    return direction
}

export function generateAreaShape(cells: PackedAreaCells) {
    const points = [] as string[]

    let x = parseInt(Object.keys(cells)[0])
    let y = cells[x][0]
    let direction = 0
    let start = null as null | [number, number, number]

    do {
        const parity = y & 1
        const [ox, oy] = DIRECTIONS[parity][direction]
        const nextX = x + ox
        const nextY = y + oy

        if (isCoordsBelongsToArea(cells, nextX, nextY)) {
            x = nextX
            y = nextY

            if (points.length) {
                direction = turn(direction, -2)
            }
        } else {
            if (!points.length) {
                start = [x, y, direction]
            }

            const point = createPoint(x, y, direction)

            points.push(point)
            direction = turn(direction, 1)
        }
    } while (!start || x !== start[0] || y !== start[1] || direction !== start[2])

    return `M ${points.join(' ')} z`
}
