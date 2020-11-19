import './reset.scss'
//import { fractal } from '@fract/core'
import { render } from '@fract/jsx'
//import styles from './style.scss'
import { Factors } from './factors'
import { Loadable } from './loadable'
import { Antistress } from './antistress'
import { Todos } from './todos'

// const App = fractal(async function* () {
//     while (true) {
//         console.log(styles)
//         yield <div className={styles.block}>Hello world</div>
//     }
// })

render(new Antistress(), document.getElementById('app')!)
