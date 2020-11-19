import { fraction, Fraction, Fractal, list, List, Context } from '@fract/core'
import { ENTER_KEY, ESCAPE_KEY, FilterMode } from '../const'
import { FILTER, MODE, Mode } from '../factors'
import { Todo, TodoData } from './todo'
import { connect } from '../utils'
import { Footer } from './footer'
import { CreateEvent, RemoveEvent, RemoveCompletedEvent, ChangeFilterEvent } from './events'
import { Container, Wrapper, Header, Main, NewTodoNameInput, FilteredList } from './app.comp'

export type AppView = Fractal<AppData | AppJsx>
export type AppData = { filter: FilterMode; todos: TodoData[] }
export type AppJsx = JSX.Element

export class App extends Fractal<AppView> {
    readonly filter: Fraction<FilterMode>
    readonly todos: List<Todo>

    constructor({ filter = FilterMode.All, todos = [] }: AppData) {
        super()
        this.filter = fraction(filter)
        this.todos = list(
            todos.map((data) => new Todo(data)),
            { delegation: false }
        )
    }

    collector(ctx: Context) {
        ctx.on(CreateEvent, (e) => this.create(e.name))
        ctx.on(RemoveEvent, (e) => this.remove(e.todo))
        ctx.on(RemoveCompletedEvent, () => this.removeCompleted())
        ctx.on(ChangeFilterEvent, (e) => this.changeFilter(e.mode))

        switch (ctx.get(MODE)) {
            case Mode.Data:
                return workInDataMode.call(this)
            case Mode.Jsx:
                return workInJsxMode.call(this, ctx)
        }

        throw 'Unknown MODE'
    }

    create(name: string) {
        const id = (~~(Math.random() * 1e8)).toString(16)
        const todo = new Todo({ id, name })

        this.todos.insertAt(0, todo)
    }

    remove(todo: Todo) {
        this.todos.delete(todo)
    }

    removeCompleted() {
        const newTodos = this.todos.get().filter((todo) => !todo.done.get())
        this.todos.set(newTodos)
    }

    changeFilter(mode: FilterMode) {
        this.filter.set(mode)
    }
}

export class Counters extends Fractal<any> {
    readonly todos: List<Todo>

    constructor(todos: List<Todo>) {
        super()
        this.todos = todos
    }

    async *collector() {
        while (true) {
            let active = 0
            let completed = 0

            for (const todo of yield* this.todos) {
                ;(yield* todo.done) ? completed++ : active++
            }

            yield { completed, active }
        }
    }
}

export class Filtered extends Fractal<Todo[]> {
    readonly todos: List<Todo>
    readonly filter: Fraction<FilterMode>

    constructor(todos: List<Todo>, filter: Fraction<FilterMode>) {
        super()
        this.todos = todos
        this.filter = filter
    }

    async *collector() {
        while (true) {
            const filter = yield* this.filter
            const acc = [] as Todo[]

            for (const todo of yield* this.todos) {
                const done = yield* todo.done

                if (
                    filter === FilterMode.All ||
                    (filter === FilterMode.Active && !done) ||
                    (filter === FilterMode.Completed && done)
                ) {
                    acc.push(todo)
                }
            }

            yield acc
        }
    }
}

async function* workInDataMode(this: App) {
    while (true) {
        yield {
            filter: yield* this.filter,
            todos: yield* connect(this.todos),
        }
    }
}

async function* workInJsxMode(this: App, ctx: Context) {
    ctx.set(FILTER, this.filter)

    const filtered = new Filtered(this.todos, this.filter)
    const counters = new Counters(this.todos)
    const footer = new Footer(counters)
    const newTodoName = fraction('')

    const handleNewTodoNameInputChange = (e: any) => {
        newTodoName.set(e.target.value)
    }
    const handleNewTodoNameInputKeyDown = ({ keyCode }: any) => {
        const name = newTodoName.get()

        if (name) {
            if (keyCode === ENTER_KEY) {
                ctx.dispath(new CreateEvent(name))
            }
            if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
                newTodoName.set('')
            }
        }
    }

    while (true) {
        yield (
            <Container>
                <Wrapper>
                    <Header>todos</Header>
                    <Main>
                        <NewTodoNameInput
                            value={yield* newTodoName}
                            onInput={handleNewTodoNameInputChange}
                            onKeyDown={handleNewTodoNameInputKeyDown}
                            placeholder="What needs to be done?"
                        />
                        <FilteredList>{yield* connect(filtered)}</FilteredList>
                    </Main>
                    {yield* footer}
                </Wrapper>
            </Container>
        )
    }
}
