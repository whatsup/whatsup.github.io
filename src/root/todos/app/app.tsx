import { Fractal, list, List, Context, Cause, cause, conse } from 'whatsup'
import { ENTER_KEY, ESCAPE_KEY } from '../const'
import { FILTER } from './app.factors'
import { Todo, TodoData } from './todo'
import { connect } from '../utils'
import { Footer } from './footer'
import { Filter, FilterValue } from './filter'
import { CreateEvent, RemoveEvent, RemoveCompletedEvent } from './events'
import { Container, Wrapper, Header, Main, NewTodoNameInput, FilteredList } from './app.comp'

export type AppData = { filter: FilterValue; todos: TodoData[] }

export class App extends Fractal<JSX.Element> {
    readonly filter: Filter
    readonly todos: List<Todo>
    readonly data = cause<AppData>(makeAppData, this)

    constructor({ filter = FilterValue.All, todos = [] }: AppData) {
        super()
        this.filter = new Filter(filter)
        this.todos = list(todos.map((data) => new Todo(data)))
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

    *whatsUp(ctx: Context) {
        ctx.on(CreateEvent, (e) => this.create(e.name))
        ctx.on(RemoveEvent, (e) => this.remove(e.todo))
        ctx.on(RemoveCompletedEvent, () => this.removeCompleted())

        ctx.share(FILTER, this.filter)

        const filtered = new Filtered(this.todos, this.filter)
        const counters = new Counters(this.todos)
        const footer = new Footer(counters)
        const newTodoName = conse('')

        const handleNewTodoNameInputChange = (e: any) => {
            newTodoName.set(e.target.value)
        }
        const handleNewTodoNameInputKeyDown = ({ keyCode }: any) => {
            const name = newTodoName.get()

            if (name) {
                if (keyCode === ENTER_KEY) {
                    ctx.dispath(new CreateEvent(name as string))
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
}

export class Counters extends Cause<any> {
    readonly todos: List<Todo>

    constructor(todos: List<Todo>) {
        super()
        this.todos = todos
    }

    *whatsUp() {
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

export class Filtered extends Cause<Todo[]> {
    readonly todos: List<Todo>
    readonly filter: Filter

    constructor(todos: List<Todo>, filter: Filter) {
        super()
        this.todos = todos
        this.filter = filter
    }

    *whatsUp() {
        while (true) {
            const filter = yield* this.filter.value
            const acc = [] as Todo[]

            for (const todo of yield* this.todos) {
                const done = yield* todo.done

                if (
                    filter === FilterValue.All ||
                    (filter === FilterValue.Active && !done) ||
                    (filter === FilterValue.Completed && done)
                ) {
                    acc.push(todo)
                }
            }

            yield acc
        }
    }
}

function* makeAppData(this: App) {
    while (true) {
        const filter = yield* this.filter.value
        const todos = [] as TodoData[]

        for (const todo of yield* this.todos) {
            todos.push(yield* todo.data)
        }

        yield { filter, todos }
    }
}
