import styles from './app.scss'
import { Fractal, fractal } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { User } from './user'
import { MODE, Mode } from './factors'

export class App extends Fractal<JSX.Element> {
    readonly user = new User('John', 33);

    *stream() {
        const { user } = this

        const json = fractal(function* (ctx) {
            ctx.set(MODE, Mode.Json)
            return user
        })
        const view = fractal(function* (ctx) {
            ctx.set(MODE, Mode.View)
            return user
        })
        const edit = fractal(function* (ctx) {
            ctx.set(MODE, Mode.Edit)
            return user
        })

        while (true) {
            yield (
                <Container>
                    <Title>Different views of one model</Title>
                    <Flex>
                        <Box>
                            <SubTitle>User as Edit</SubTitle>
                            {yield* edit}
                        </Box>
                        <Box>
                            <SubTitle>User as View</SubTitle>
                            {yield* view}
                        </Box>
                        <Box>
                            <SubTitle>User as Json</SubTitle>
                            {yield* json}
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
