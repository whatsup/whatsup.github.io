import styles from './app.scss'
import { Fractal, fractal } from 'whatsup'
import { WhatsJSX } from '@whatsup/jsx'
import { User } from './user'
import { MODE, Mode } from './factors'

export class App extends Fractal<JSX.Element> {
    readonly user = new User('John', 33);

    *whatsUp() {
        const { user } = this

        const json = fractal(function* (ctx) {
            ctx.define(MODE, Mode.Json)
            while (true) {
                yield yield* user
            }
        })
        const view = fractal(function* (ctx) {
            ctx.define(MODE, Mode.View)
            while (true) {
                yield yield* user
            }
        })
        const edit = fractal(function* (ctx) {
            ctx.define(MODE, Mode.Edit)
            while (true) {
                yield yield* user
            }
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

function Container({ children }: WhatsJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Title({ children }: WhatsJSX.Attributes) {
    return <header className={styles.title}>{children}</header>
}

function Flex({ children }: WhatsJSX.Attributes) {
    return <div className={styles.flex}>{children}</div>
}

function Box({ children }: WhatsJSX.Attributes) {
    return <div className={styles.box}>{children}</div>
}

function SubTitle({ children }: WhatsJSX.Attributes) {
    return <div className={styles.subTitle}>{children}</div>
}
