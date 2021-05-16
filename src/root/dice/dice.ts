// class Game {
//     readonly players: Player[]
//     readonly world: World

//     constructor(playersCount: number, worldSize: number, areaW: number, areaH: number) {
//         this.players = Array.from({ length: playersCount }, (_, i) => new Player(i))
//         this.world = new World(this, worldSize, areaW, areaH)
//     }
// }

// class World {
//     readonly game: Game
//     private readonly cells: Cell[][]
//     private readonly areas: Area[]

//     constructor(game: Game, size: number, areaW: number, areaH: number) {
//         this.game = game
//         this.areas = []
//         this.cells = Array.from({ length: areaW * size }, (_, x) => {
//             return Array.from({ length: areaH * size }, (_, y) => {
//                 return new Cell(this, x, y)
//             })
//         })

//         const playersCount = game.players.length
//         const perimeterLength = size * 4 - 4
//         const excessAreaCount = size ** 2 % playersCount
//         const excessAreaIndexes = [] as number[]

//         while (excessAreaIndexes.length < excessAreaCount) {
//             const index = Math.floor(Math.random() * perimeterLength)

//             if (excessAreaIndexes.includes(index)) {
//                 continue
//             }

//             excessAreaIndexes.push(index)
//         }

//         let perimeterIndex = 0

//         for (let x = 0; x < size; x++) {
//             for (let y = 0; y < size; y++) {
//                 if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
//                     perimeterIndex++

//                     if (excessAreaIndexes.includes(perimeterIndex)) {
//                         continue
//                     }
//                 }

//                 const centerX = Math.floor(Math.random() * (areaW - 2)) + 1
//                 const centerY = Math.floor(Math.random() * (areaH - 2)) + 1
//                 const center = this.get(centerX, centerY)!
//                 const area = new Area(this, center)

//                 center.setArea(area)
//                 this.areas.push(area)
//             }
//         }
//     }

//     get(x: number, y: number) {
//         try {
//             return this.cells[x][y]
//         } catch (e) {
//             return null
//         }
//     }
// }

// const DIRECTIONS = [
//     [+1, +0],
//     [+0, -1],
//     [-1, -1],
//     [-1, +0],
//     [-1, +1],
//     [+0, +1],
// ]

// class Cell {
//     readonly world: World
//     readonly x: number
//     readonly y: number
//     private area!: Area

//     constructor(world: World, x: number, y: number) {
//         this.world = world
//         this.x = x
//         this.y = y
//     }

//     setArea(area: Area) {
//         this.area = area
//     }

//     getArea() {
//         return this.area
//     }

//     *neighbors() {
//         for (const [ox, oy] of DIRECTIONS) {
//             const cell = this.world.get(this.x + ox, this.y + oy)

//             if (cell) {
//                 yield cell
//             }
//         }
//     }
// }

// class Area {
//     readonly world: World
//     readonly center: Cell
//     readonly cells: Cell[]
//     private readonly neighbors = [] as Area[]

//     constructor(world: World, center: Cell) {
//         this.world = world
//         this.center = center
//         this.cells = [center]
//     }

//     expand() {}
// }

// class Player {
//     readonly id: number

//     constructor(id: number) {
//         this.id = id
//     }
// }
