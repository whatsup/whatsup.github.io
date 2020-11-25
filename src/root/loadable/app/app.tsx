import styles from './app.scss'
import { Fractal } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { Friends } from './friends'
import { Groups } from './groups'
import { Menu } from './menu'

export class App extends Fractal<JSX.Element> {
    readonly friends = new Friends()
    readonly groups = new Groups()
    readonly menu = new Menu();

    *stream() {
        while (true) {
            yield (
                <Container>
                    <Logo>Loadable</Logo>
                    {yield* this.menu}
                    <Title>Fractal sets</Title>
                    {yield* this.groups}
                    {yield* this.friends}
                </Container>
            )
        }
    }
}

function Container({ children }: FractalJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Logo({ children }: FractalJSX.Attributes) {
    return <div className={styles.logo}>{children}</div>
}

function Title({ children }: FractalJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}
