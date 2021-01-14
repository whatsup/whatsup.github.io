import { Fractal, Context, cause } from 'whatsup'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData, App } from './app/app'

export class Antistress extends Fractal<JSX.Element> {
    readonly app: App
    readonly jsx = cause(antistressJsx, this)
    readonly data = cause(antistressData, this)

    constructor() {
        super()
        const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
        this.app = new App(data)
    }

    *whatsUp() {
        while (true) {
            const data = yield* this.data

            localStorage.setItem(STORE_KEY, JSON.stringify(data))

            yield yield* this.jsx
        }
    }
}

function* antistressJsx(this: Antistress, ctx: Context) {
    ctx.define(MODE, Mode.Jsx)
    while (true) yield yield* this.app
}

function* antistressData(this: Antistress, ctx: Context) {
    ctx.define(MODE, Mode.Data)
    while (true) yield yield* this.app
}
