import './reset.scss'
import styles from './root.scss'
import { Computed } from '@fract/core'
import { route } from '@fract/route'
import { redirect } from '@fract/browser-pathname'
import { FractalJSX } from '@fract/jsx'
import { Todos } from './todos'
import { Factors } from './factors'
import { Sierpinski } from './sierpinski'
import { Antistress } from './antistress'
import { Loadable } from './loadable'

enum Route {
    Todos = '/todos',
    Antistress = '/antistress',
    Loadable = '/loadable',
    Factors = '/factors',
    Sierpinski = '/sierpinski',
}

export class Root extends Computed<JSX.Element> {
    private todos = new Todos()
    private antistress = new Antistress()
    private loadable = new Loadable()
    private factors = new Factors()
    private sierpinski = new Sierpinski();

    *stream() {
        const todosRoute = route(Route.Todos, this.todos)
        const antistressRoute = route(Route.Antistress, this.antistress)
        const loadableRoute = route(Route.Loadable, this.loadable)
        const factorsRoute = route(Route.Factors, this.factors)
        const sierpinskiRoute = route(Route.Sierpinski, this.sierpinski)

        while (true) {
            yield (yield* todosRoute) ||
                (yield* antistressRoute) ||
                (yield* loadableRoute) ||
                (yield* factorsRoute) ||
                (yield* sierpinskiRoute) || (
                    <Container>
                        <Title>Fractal examples</Title>
                        <Flex>
                            <TodosBtn onClick={() => redirect(Route.Todos)}>Todos</TodosBtn>
                            <AntistressBtn onClick={() => redirect(Route.Antistress)}>Antistress</AntistressBtn>
                            <LoadableBtn onClick={() => redirect(Route.Loadable)}>Loadable</LoadableBtn>
                            <FactorsBtn onClick={() => redirect(Route.Factors)}>Factors</FactorsBtn>
                            <SierpinskyBtn onClick={() => redirect(Route.Sierpinski)}>Sierpinski</SierpinskyBtn>
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

type BtnProps = FractalJSX.Attributes & {
    onClick: (event: FractalJSX.MouseEvent<HTMLButtonElement>) => void
}

function TodosBtn({ children, onClick }: BtnProps) {
    return (
        <button className={styles.todosBtn} onClick={onClick}>
            {children}
        </button>
    )
}

function AntistressBtn({ children, onClick }: BtnProps) {
    return (
        <button className={styles.antistressBtn} onClick={onClick}>
            {children}
        </button>
    )
}

function LoadableBtn({ children, onClick }: BtnProps) {
    return (
        <button className={styles.loadableBtn} onClick={onClick}>
            {children}
        </button>
    )
}

function FactorsBtn({ children, onClick }: BtnProps) {
    return (
        <button className={styles.factorsBtn} onClick={onClick}>
            {children}
        </button>
    )
}

function SierpinskyBtn({ children, onClick }: BtnProps) {
    return (
        <button className={styles.sierpinskiBtn} onClick={onClick}>
            {children}
        </button>
    )
}
