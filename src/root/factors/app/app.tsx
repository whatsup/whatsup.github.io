import styles from './app.scss'
import { Fractal } from '@fract/core'
import { User } from './user'
import { FractalJSX } from '@fract/jsx'

export class App extends Fractal<JSX.Element> {
    readonly user = new User({ name: 'John', age: 33 });

    *stream() {
        while (true) {
            yield (
                <Container>
                    <Title>Different views of one model</Title>
                    <Flex>
                        <Box>
                            <SubTitle>User as Edit</SubTitle>
                            {yield* this.user.edit}
                        </Box>
                        <Box>
                            <SubTitle>User as View</SubTitle>
                            {yield* this.user.view}
                        </Box>
                        <Box>
                            <SubTitle>User as Json</SubTitle>
                            {yield* this.user.json}
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
