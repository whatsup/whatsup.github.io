import { fractal } from '@fract/core'
import { render } from '@fract/jsx'
import styles from './style.scss'

const App = fractal(async function* () {
    while (true) {
        console.log(styles)
        yield <div className={styles.block}>Hello world</div>
    }
})

render(App, document.getElementById('app')!)
