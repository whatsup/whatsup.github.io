import { fractal } from '@fract/core'
import { Color, STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData } from './typings'

const initialData = JSON.stringify({
    currentColor: Color.Default,
    tree: Color.Default,
} as AppData)

export const Antistress = fractal(async function* _Antistress() {
    const { newApp } = await import('./app')

    const data = JSON.parse(localStorage.getItem(STORE_KEY) || initialData) as AppData
    const App = newApp(data)

    yield* fractal(async function* _AutoSyncWithLocalStore() {
        yield* MODE(Mode.Data)

        while (true) {
            yield localStorage.setItem(STORE_KEY, JSON.stringify(yield* App))
        }
    })

    return App
})
