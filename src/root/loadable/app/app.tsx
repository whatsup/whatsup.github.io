import styles from './app.scss'
import { Fractal } from 'whatsup'
import { WhatsJSX } from '@whatsup-js/jsx'
import { Friends } from './friends'
import { Groups } from './groups'
import { Menu } from './menu'

export class App extends Fractal<JSX.Element> {
    readonly friends = new Friends()
    readonly groups = new Groups()
    readonly menu = new Menu();

    *whatsUp() {
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

function Container({ children }: WhatsJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Logo({ children }: WhatsJSX.Attributes) {
    return <div className={styles.logo}>{children}</div>
}

function Title({ children }: WhatsJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}
