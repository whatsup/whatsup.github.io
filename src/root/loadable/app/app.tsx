import styles from './app.scss'
import { Fractal } from '@fract/core'
import { Friends } from './friends'
import { Groups } from './groups'
import { Menu } from './menu'

export class App extends Fractal<JSX.Element> {
    readonly friends = new Friends()
    readonly groups = new Groups()
    readonly menu = new Menu()

    async *collector() {
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

type Props = { children: string | JSX.Element | JSX.Element[] }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}

function Logo({ children }: Props) {
    return <div className={styles.logo}>{children}</div>
}

function Title({ children }: Props) {
    return <div className={styles.title}>{children}</div>
}
