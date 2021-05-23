import { Fractal, Context, List, list } from 'whatsup'
import { PlayerData } from './generators'

export class Player extends Fractal<JSX.Element> {
    readonly id: number
    readonly number: 1 | 2 | 3 | 4 | 5 | 6
    readonly areas: List<number>

    constructor({ id, areas }: PlayerData, number: 1 | 2 | 3 | 4 | 5 | 6) {
        super()
        this.id = id
        this.number = number
        this.areas = list(areas)
    }

    *whatsUp(ctx: Context) {}
}
