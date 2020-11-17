import styles from './app.scss'
import { Emitter, Context } from '@fract/core'
import { Api } from '../api'
import { API } from '../factors'

export class App extends Emitter<JSX.Element> {
    async *collector(ctx: Context) {
        const [{ Menu }, { Groups }, { Friends }] = await Promise.all([
            import('./menu'),
            import('./groups'),
            import('./friends'),
        ])

        ctx.set(API, new Api())

        console.log(yield* Groups)

        while (true) {
            yield (
                <Container>
                    <Logo>Loadable</Logo>
                    {yield* Menu}
                    <Title>Fractal sets</Title>
                    {yield* Groups}
                    {yield* Friends}
                </Container>
            )
        }
    }
}

type Props = { children: string | JSX.Element | JSX.Element[] }

function Container(props: Props) {
    return <div className={styles.container}>{props.children}</div>
}

function Logo(props: Props) {
    return <div className={styles.logo}>{props.children}</div>
}

function Title(props: Props) {
    return <div className={styles.title}>{props.children}</div>
}
