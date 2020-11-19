import styles from './app.scss'
import { fractal, Fractal } from '@fract/core'
import { MODE, Mode } from '../factors'
import { User } from './user'
import { FractalJSX } from '@fract/jsx'

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

function Container({ children }: FractalJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Title({ children }: FractalJSX.Attributes) {
    return <header className={styles.title}>{children}</header>
}

function Flex({ children }: FractalJSX.Attributes) {
    return <div className={styles.flex}>{children}</div>
}

function Box({ children }: FractalJSX.Attributes) {
    return <div className={styles.box}>{children}</div>
}

function SubTitle({ children }: FractalJSX.Attributes) {
    return <div className={styles.subTitle}>{children}</div>
}
