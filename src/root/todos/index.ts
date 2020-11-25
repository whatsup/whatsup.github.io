import { Computed, RootContext, computed } from '@fract/core'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData } from './app/app'
import { App } from './app/app'

export class Todos extends Computed<any> {
    readonly app: App
    readonly jsx = computed(todosJsx, { thisArg: this })
    readonly data = computed(todosData, { thisArg: this })

    constructor() {
        super()
        const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
        this.app = new App(data)
    }

    *stream() {
        while (true) {
            const data = yield* this.data

            localStorage.setItem(STORE_KEY, JSON.stringify(data))

            yield yield* this.jsx
        }
    }
}

function* todosData(this: Todos, ctx: RootContext) {
    ctx.set(MODE, Mode.Data)
    while (true) yield yield* this.app
}

function* todosJsx(this: Todos, ctx: RootContext) {
    ctx.set(MODE, Mode.Jsx)
    while (true) yield yield* this.app
}
