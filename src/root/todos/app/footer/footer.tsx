import { Fractal, Context } from 'whatsup'
import { FILTER } from '../app.factors'
import { RemoveCompletedEvent } from '../events'
import { Counters } from '../app'
import { Container, Flex, Left, Clear, Help } from './footer.comp'

export class Footer extends Fractal<JSX.Element> {
    readonly counters: Counters

    constructor(counters: Counters) {
        super()
        this.counters = counters
    }

    *whatsUp(ctx: Context) {
        const filter = ctx.get(FILTER)

        while (true) {
            const { active, completed } = yield* this.counters

            yield (
                <Container>
                    <Flex>
                        <Left visible={!!active}>{active} items left</Left>
                        {yield* filter}
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
