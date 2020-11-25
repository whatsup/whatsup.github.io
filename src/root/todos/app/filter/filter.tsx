import { Container, Button } from './filter.comp'
import { Observable, computed } from '@fract/core'

export enum Value {
    All,
    Active,
    Completed,
}

export class Filter extends Observable<Value> {
    readonly jsx = computed<JSX.Element>(jsx, { thisArg: this })
}

function* jsx(this: Filter) {
    while (true) {
        const value = yield* this

        yield (
            <Container>
                <Button active={value === Value.All} onClick={() => this.set(Value.All)}>
                    All
                </Button>
                <Button active={value === Value.Active} onClick={() => this.set(Value.Active)}>
                    Active
                </Button>
                <Button active={value === Value.Completed} onClick={() => this.set(Value.Completed)}>
                    Completed
                </Button>
            </Container>
        )
    }
}
