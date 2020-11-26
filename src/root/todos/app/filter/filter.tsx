import { Container, Button } from './filter.comp'
import { Observable, Fractal, observable } from '@fract/core'

export enum Value {
    All,
    Active,
    Completed,
}

export class Filter extends Fractal<JSX.Element> {
    readonly value: Observable<Value>

    constructor(value: Value) {
        super()
        this.value = observable(value)
    }

    *stream() {
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
