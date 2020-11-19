import styles from './app.scss'
import { fractal, Fractal } from '@fract/core'
import { MODE, Mode } from '../factors'
import { User } from './user'

export class App extends Fractal<JSX.Element> {
    readonly user = new User('John', 33)

    async *collector() {
        const User = this.user

        const Edit = fractal(async function* (ctx) {
            ctx.set(MODE, Mode.Edit)
            return User
        })

        const View = fractal(async function* (ctx) {
            ctx.set(MODE, Mode.View)
            return User
        })

        const Json = fractal(async function* (ctx) {
            ctx.set(MODE, Mode.Json)
            return User
        })

        while (true) {
            yield (
                <Container>
                    <Title>Factors of work</Title>
                    <Flex>
                        <Box>
                            <SubTitle>User as Edit</SubTitle>
                            {yield* Edit}
                        </Box>
                        <Box>
                            <SubTitle>User as View</SubTitle>
                            {yield* View}
                        </Box>
                        <Box>
                            <SubTitle>User as Json</SubTitle>
                            {yield* Json}
                        </Box>
                    </Flex>
                </Container>
            )
        }
    }
}

type Props = { children: string | JSX.Element | JSX.Element[] }

function Container(props: Props) {
    return <section className={styles.container}>{props.children}</section>
}

function Title(props: Props) {
    return <header className={styles.title}>{props.children}</header>
}

function Flex(props: Props) {
    return <div className={styles.flex}>{props.children}</div>
}

function Box(props: Props) {
    return <div className={styles.box}>{props.children}</div>
}

function SubTitle(props: Props) {
    return <div className={styles.subTitle}>{props.children}</div>
}
