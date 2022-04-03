import './root/reset.scss'
// import { Root } from './root'
// import { render } from '@whatsup/jsx'
//import './root/dice/index'
import { render } from '@whatsup/jsx'
import { observable } from 'whatsup'

//render(new Root())

function* Counter() {
    const value = observable(1)

    while (true) {
        console.log('render Counter')

        const val = value.get()

        yield (
            <div>
                <div>{val}</div>
                <button onClick={() => value.set(val + 1)}>click</button>
            </div>
        )
    }
}

const Wrapper = () => {
    console.log('Render Wrapper')
    return <Counter />
}

function* App() {
    while (true) {
        console.log('render App')

        yield <Wrapper />
    }
}

render(App)
