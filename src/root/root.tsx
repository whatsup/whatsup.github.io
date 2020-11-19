import './reset.scss'
import styles from './root.scss'
import { tmp, Fractal } from '@fract/core'
import { Pathname } from '@fract/browser-pathname'
import type { Todos } from './todos'
import type { Antistress } from 'root/antistress'
import type { Loadable } from './loadable'
import type { Factors } from './factors'
import { FractalJSX } from '@fract/jsx'

enum Route {
    Todos = '/todos',
    Antistress = '/antistress',
    Loadable = '/loadable',
    Factors = '/factors',
    Editor = '/editor',
}

export class Root extends Fractal<JSX.Element> {
    private readonly pathname = new Pathname()
    private todos!: Todos
    private antistress!: Antistress
    private loadable!: Loadable
    private factors!: Factors

    private async initTodos() {
        if (!this.todos) {
            const { Todos } = await import('./todos')
            this.todos = new Todos()
        }
        return this.todos
    }

    private async initAntistress() {
        if (!this.antistress) {
            const { Antistress } = await import('./antistress')
            this.antistress = new Antistress()
        }
        return this.antistress
    }

    private async initLoadable() {
        if (!this.loadable) {
            const { Loadable } = await import('./loadable')
            this.loadable = new Loadable()
        }
        return this.loadable
    }

    private async initFactors() {
        if (!this.factors) {
            const { Factors } = await import('./factors')
            this.factors = new Factors()
        }
        return this.factors
    }

    async *collector() {
        const redirect = (route: Route) => this.pathname.redirect(route)

        while (true) {
            yield tmp(<Loading />)

            switch (yield* this.pathname) {
                case Route.Todos:
                    yield this.initTodos()
                    continue
                case Route.Antistress:
                    yield this.initAntistress()
                    continue
                case Route.Loadable:
                    yield this.initLoadable()
                    continue
                case Route.Factors:
                    yield this.initFactors()
                    continue
                default:
                    yield (
                        <Container>
                            <Title>Fractal examples</Title>
                            <Flex>
                                <TodosBtn onClick={() => redirect(Route.Todos)}>Todos</TodosBtn>
                                <AntistressBtn onClick={() => redirect(Route.Antistress)}>Antistress</AntistressBtn>
                                <LoadableBtn onClick={() => redirect(Route.Loadable)}>Loadable</LoadableBtn>
                                <FactorsBtn onClick={() => redirect(Route.Factors)}>Factors</FactorsBtn>
                            </Flex>
                        </Container>
                    )
                    continue
            }
        }
    }
}

function Loading() {
    return (
        <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
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
