import { Container, Button } from './filter.comp'
import { Conse, Fractal, conse } from 'whatsup'

export enum Value {
    All,
    Active,
    Completed,
}

export class Filter extends Fractal<JSX.Element> {
    readonly value: Conse<Value>

    constructor(value: Value) {
        super()
        this.value = conse(value)
    }

    *whatsUp() {
        while (true) {
            const value = yield* this.value

            yield (
                <Container>
                    <Button active={value === Value.All} onClick={() => this.value.set(Value.All)}>
                        All
                    </Button>
                    <Button active={value === Value.Active} onClick={() => this.value.set(Value.Active)}>
                        Active
                    </Button>
                    <Button active={value === Value.Completed} onClick={() => this.value.set(Value.Completed)}>
                        Completed
                    </Button>
                </Container>
            )
        }
    }
}
