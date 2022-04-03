import './root/reset.scss'
// import { Root } from './root'
// import { render } from '@whatsup/jsx'
//import './root/dice/index'
import { render } from '@whatsup/jsx'
import { observable } from 'whatsup'
import { App } from './root/sierpinski/app'
//render(new Root())

// function* Counter() {
//     const value = observable(1)

//     while (true) {
//         console.log('render Counter')

//         const val = value.get()

//         yield (
//             <div>
//                 <div>{val}</div>
//                 <button onClick={() => value.set(val + 1)}>click</button>
//             </div>
//         )
//     }
// }

// function* App() {
//     while (true) {
//         console.log('render App')

//         yield (
//             <div>
//                 <Counter />
//                 <Counter />
//             </div>
//         )
//     }
// }

render(App)
