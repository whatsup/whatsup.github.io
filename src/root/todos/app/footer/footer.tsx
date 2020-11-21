import { Fractal, Context } from '@fract/core'
import { FilterMode } from 'todos/const'
import { FILTER } from 'todos/factors'
import { RemoveCompletedEvent, ChangeFilterEvent } from '../events'
import { Counters } from '../app'
import { Container, Flex, Left, Filters, Clear, Help, FilterBtn } from './footer.comp'

export class Footer extends Fractal<JSX.Element> {
    readonly counters: Counters

    constructor(counters: Counters) {
        super()
        this.counters = counters
    }

    *collector(ctx: Context) {
        const allFilter = new Filter('All', FilterMode.All)
        const activeFilter = new Filter('Active', FilterMode.Active)
        const completedFilter = new Filter('Completed', FilterMode.Completed)

        while (true) {
            const { active, completed } = yield* this.counters

            yield (
                <Container>
                    <Flex>
                        <Left visible={!!active}>{active} items left</Left>
                        <Filters>
                            {yield* allFilter}
                            {yield* activeFilter}
                            {yield* completedFilter}
                        </Filters>
                        <Clear onClick={() => ctx.dispath(new RemoveCompletedEvent())} visible={!!completed}>
                            Clear completed
                        </Clear>
                    </Flex>
                    <Help>Double click to edit a todo</Help>
                </Container>
            )
        }
    }
}

class Filter extends Fractal<JSX.Element> {
    readonly name: string
    readonly mode: FilterMode

    constructor(name: string, mode: FilterMode) {
        super()
        this.name = name
        this.mode = mode
    }

    *collector(ctx: Context) {
        const { mode, name } = this

        while (true) {
            const filter = yield* ctx.get(FILTER)!

            yield (
                <FilterBtn onClick={() => ctx.dispath(new ChangeFilterEvent(mode))} active={filter === mode}>
                    {name}
                </FilterBtn>
            )
        }
    }
}
