import { Computed, Context, computed } from '@fract/core'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData, App } from './app/app'

export class Antistress extends Computed<JSX.Element> {
    readonly app: App
    readonly jsx = computed(antistressJsx, { thisArg: this })
    readonly data = computed(antistressData, { thisArg: this })

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

function* antistressJsx(this: Antistress, ctx: Context) {
    ctx.set(MODE, Mode.Jsx)
    while (true) yield yield* this.app
}

function* antistressData(this: Antistress, ctx: Context) {
    ctx.set(MODE, Mode.Data)
    while (true) yield yield* this.app
}
